<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Status;
use Barryvdh\DomPDF\Facade\Pdf as DomPdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class FinancialReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Overall Financial Summary
        $totalExpenses = Expense::where('company_id', $user->company_id)->sum('amount');
        $totalInvoices = Invoice::where('company_id', $user->company_id)->sum('amount');
        $netProfit = $totalInvoices - $totalExpenses;

        // Monthly breakdown for last 6 months
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthExpenses = Expense::where('company_id', $user->company_id)
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->sum('amount');

            $monthInvoices = Invoice::where('company_id', $user->company_id)
                ->whereBetween('due_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $months[] = [
                'month' => $month->format('M Y'),
                'expenses' => round($monthExpenses, 2),
                'invoices' => round($monthInvoices, 2),
                'profit' => round($monthInvoices - $monthExpenses, 2),
            ];
        }

        // Expenses by project
        $expensesByProject = Expense::where('company_id', $user->company_id)
            ->with('project')
            ->get()
            ->groupBy('project_id')
            ->map(function ($expenses, $projectId) {
                return [
                    'project_id' => $projectId,
                    'project_name' => $expenses->first()->project?->name ?? 'No Project',
                    'total' => round($expenses->sum('amount'), 2),
                    'count' => $expenses->count(),
                ];
            })
            ->sortByDesc('total')
            ->take(10)
            ->values();

        // Invoices by status
        $invoicesByStatus = Invoice::where('company_id', $user->company_id)
            ->with('status')
            ->get()
            ->groupBy('status_id')
            ->map(function ($invoices, $statusId) {
                $status = $invoices->first()->status;

                return [
                    'status_id' => $statusId,
                    'status_name' => $status?->status_name ?? 'No Status',
                    'total' => round($invoices->sum('amount'), 2),
                    'count' => $invoices->count(),
                ];
            })
            ->values();

        // Overdue invoices
        $overdueInvoices = Invoice::where('company_id', $user->company_id)
            ->with(['client', 'project', 'status'])
            ->where('due_date', '<', now())
            ->whereHas('status', function ($q) {
                $q->where('status_name', 'LIKE', '%unpaid%')
                    ->orWhere('status_name', 'LIKE', '%pending%');
            })
            ->latest('due_date')
            ->take(10)
            ->get()
            ->map(function ($invoice) {
                return [
                    'invoice_id' => $invoice->invoice_id,
                    'amount' => $invoice->amount,
                    'due_date' => $invoice->due_date,
                    'client' => $invoice->client?->name,
                    'project' => $invoice->project?->name,
                    'status' => $invoice->status?->status_name,
                    'days_overdue' => now()->diffInDays($invoice->due_date),
                ];
            });

        return Inertia::render('reports/financial/index', [
            'summary' => [
                'total_expenses' => round($totalExpenses, 2),
                'total_revenue' => round($totalInvoices, 2),
                'net_profit' => round($netProfit, 2),
                'profit_margin' => $totalInvoices > 0
                    ? round(($netProfit / $totalInvoices) * 100, 2)
                    : 0,
            ],
            'monthlyTrend' => $months,
            'expensesByProject' => $expensesByProject,
            'invoicesByStatus' => $invoicesByStatus,
            'overdueInvoices' => $overdueInvoices,
        ]);
    }

    public function expenses()
    {
        $user = auth()->user();

        // Get all expenses with relationships
        $expenses = Expense::where('company_id', $user->company_id)
            ->with(['project', 'company'])
            ->latest('date')
            ->get()
            ->map(function ($expense) {
                return [
                    'expense_id' => $expense->expense_id,
                    'name' => $expense->name,
                    'amount' => $expense->amount,
                    'date' => $expense->date,
                    'project' => $expense->project?->name ?? 'No Project',
                ];
            });

        // Calculate statistics
        $totalExpenses = $expenses->sum('amount');
        $totalCount = $expenses->count();
        $avgExpense = $totalCount > 0 ? $totalExpenses / $totalCount : 0;

        // Expenses by project
        $expensesByProject = $expenses->groupBy('project')
            ->map(function ($projectExpenses, $projectName) {
                return [
                    'project' => $projectName,
                    'total' => round($projectExpenses->sum('amount'), 2),
                    'count' => $projectExpenses->count(),
                ];
            })
            ->sortByDesc('total')
            ->values();

        return Inertia::render('reports/financial/expenses', [
            'expenses' => $expenses,
            'stats' => [
                'total' => round($totalExpenses, 2),
                'count' => $totalCount,
                'average' => round($avgExpense, 2),
            ],
            'expensesByProject' => $expensesByProject,
        ]);
    }

    public function invoices()
    {
        $user = auth()->user();

        // Get all invoices with relationships
        $invoices = Invoice::where('company_id', $user->company_id)
            ->with(['client', 'project', 'status'])
            ->latest('due_date')
            ->get()
            ->map(function ($invoice) {
                $isOverdue = $invoice->due_date && Carbon::parse($invoice->due_date)->isPast();

                return [
                    'invoice_id' => $invoice->invoice_id,
                    'amount' => $invoice->amount,
                    'due_date' => $invoice->due_date,
                    'client' => $invoice->client?->name ?? 'No Client',
                    'project' => $invoice->project?->name ?? 'No Project',
                    'status' => $invoice->status?->status_name ?? 'No Status',
                    'is_overdue' => $isOverdue,
                    'days_overdue' => $isOverdue ? now()->diffInDays($invoice->due_date) : 0,
                ];
            });

        // Calculate statistics
        $totalInvoices = $invoices->sum('amount');
        $totalCount = $invoices->count();
        $paidInvoices = $invoices->filter(fn ($inv) => str_contains(strtolower($inv['status']), 'paid'));
        $unpaidInvoices = $invoices->filter(fn ($inv) => ! str_contains(strtolower($inv['status']), 'paid'));
        $overdueInvoices = $invoices->filter(fn ($inv) => $inv['is_overdue']);

        return Inertia::render('reports/financial/invoices', [
            'invoices' => $invoices,
            'stats' => [
                'total_amount' => round($totalInvoices, 2),
                'total_count' => $totalCount,
                'paid_amount' => round($paidInvoices->sum('amount'), 2),
                'paid_count' => $paidInvoices->count(),
                'unpaid_amount' => round($unpaidInvoices->sum('amount'), 2),
                'unpaid_count' => $unpaidInvoices->count(),
                'overdue_amount' => round($overdueInvoices->sum('amount'), 2),
                'overdue_count' => $overdueInvoices->count(),
            ],
        ]);
    }

    public function downloadPdf()
    {
        $user = auth()->user();

        // Overall Financial Summary
        $totalExpenses = Expense::where('company_id', $user->company_id)->sum('amount');
        $totalInvoices = Invoice::where('company_id', $user->company_id)->sum('amount');
        $netProfit = $totalInvoices - $totalExpenses;

        // Monthly breakdown for last 6 months
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthExpenses = Expense::where('company_id', $user->company_id)
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->sum('amount');

            $monthInvoices = Invoice::where('company_id', $user->company_id)
                ->whereBetween('due_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $months[] = [
                'month' => $month->format('M Y'),
                'expenses' => round($monthExpenses, 2),
                'invoices' => round($monthInvoices, 2),
                'profit' => round($monthInvoices - $monthExpenses, 2),
            ];
        }

        $html = view('reports.financial.pdf', [
            'summary' => [
                'total_expenses' => round($totalExpenses, 2),
                'total_revenue' => round($totalInvoices, 2),
                'net_profit' => round($netProfit, 2),
                'profit_margin' => $totalInvoices > 0
                    ? round(($netProfit / $totalInvoices) * 100, 2)
                    : 0,
            ],
            'months' => $months,
        ])->render();

        $pdf = DomPdf::loadHTML($html);

        return $pdf->download('financial-report-'.now()->format('Y-m-d').'.pdf');
    }

    public function downloadCsv()
    {
        $user = auth()->user();

        $expenses = Expense::where('company_id', $user->company_id)
            ->with(['project'])
            ->get();

        $filename = 'expenses-'.now()->format('Y-m-d').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($expenses) {
            $file = fopen('php://output', 'w');

            // CSV Header
            fputcsv($file, ['Date', 'Expense Name', 'Project', 'Amount']);

            // Data rows
            foreach ($expenses as $expense) {
                fputcsv($file, [
                    $expense->date,
                    $expense->name,
                    $expense->project?->name ?? 'N/A',
                    $expense->amount,
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
