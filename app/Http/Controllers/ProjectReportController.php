<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Status;
use Barryvdh\DomPDF\Facade\Pdf as DomPdf;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class ProjectReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get all statuses for filtering
        $statuses = Status::all(['status_id', 'status_name']);

        // Get projects based on user permissions
        $projectsQuery = Project::with(['status', 'client', 'manager', 'tasks'])
            ->where('company_id', $user->company_id);

        // Non-admins and non-wildcard users only see projects they manage
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            $projectsQuery->where('project_manager_id', $user->id);
        }

        $projects = $projectsQuery->get()->map(function ($project) {
            $totalTasks = $project->tasks()->count();
            $completedTasks = $project->tasks()->whereHas('status', function ($q) {
                $q->where('status_name', 'LIKE', '%complete%');
            })->count();

            $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

            return [
                'project_id' => $project->project_id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status?->status_name ?? 'No Status',
                'status_id' => $project->status_id,
                'client' => $project->client?->name ?? 'No Client',
                'manager' => $project->manager?->name ?? 'Unassigned',
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'completion_rate' => $completionRate,
                'days_remaining' => $project->end_date
                    ? max(0, now()->diffInDays($project->end_date, false))
                    : null,
            ];
        });

        return Inertia::render('reports/projects/index', [
            'projects' => $projects,
            'statuses' => $statuses,
        ]);
    }

    public function show(Project $project)
    {
        $user = auth()->user();

        // Check if user can view this project
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            if ($project->project_manager_id !== $user->id) {
                abort(403, 'You cannot view this project report.');
            }
        }

        // Load all relationships
        $project->load([
            'status',
            'client',
            'manager',
            'tasks.assignee',
            'tasks.status',
            'expenses',
            'invoices.client',
            'invoices.status',
            'documents.uploadedBy',
        ]);

        // Calculate project statistics
        $totalTasks = $project->tasks()->count();
        $completedTasks = $project->tasks()->whereHas('status', function ($q) {
            $q->where('status_name', 'LIKE', '%complete%');
        })->count();

        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        $totalExpenses = $project->expenses()->sum('amount');
        $totalInvoices = $project->invoices()->sum('amount');
        $netProfit = $totalInvoices - $totalExpenses;

        // Task breakdown by status
        $tasksByStatus = $project->tasks()
            ->with('status')
            ->get()
            ->groupBy(function ($task) {
                return $task->status?->status_name ?? 'No Status';
            })
            ->map(function ($tasks) {
                return $tasks->count();
            });

        // Task breakdown by priority
        $tasksByPriority = $project->tasks()
            ->get()
            ->groupBy('priority')
            ->map(function ($tasks) {
                return $tasks->count();
            });

        return Inertia::render('reports/projects/show', [
            'project' => [
                'project_id' => $project->project_id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status?->status_name ?? 'No Status',
                'status_id' => $project->status_id,
                'client' => $project->client?->name ?? 'No Client',
                'manager' => $project->manager?->name ?? 'Unassigned',
            ],
            'stats' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'completion_rate' => $completionRate,
                'total_expenses' => round($totalExpenses, 2),
                'total_invoices' => round($totalInvoices, 2),
                'net_profit' => round($netProfit, 2),
                'total_documents' => $project->documents()->count(),
            ],
            'tasksByStatus' => $tasksByStatus,
            'tasksByPriority' => $tasksByPriority,
            'recentTasks' => $project->tasks()
                ->with(['assignee', 'status'])
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($task) {
                    return [
                        'task_id' => $task->task_id,
                        'name' => $task->name,
                        'priority' => $task->priority,
                        'status' => $task->status?->status_name,
                        'assignee' => $task->assignee?->name,
                        'due_date' => $task->due_date,
                    ];
                }),
            'expenses' => $project->expenses()->latest()->take(10)->get(),
            'invoices' => $project->invoices()
                ->with(['client', 'status'])
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    public function downloadProjectPdf(Project $project)
    {
        $user = auth()->user();

        // Check if user can view this project
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            if ($project->project_manager_id !== $user->id) {
                abort(403, 'You cannot export this project report.');
            }
        }

        // Load all relationships
        $project->load([
            'status',
            'client',
            'manager',
            'tasks.assignee',
            'tasks.status',
            'expenses',
            'invoices.client',
            'invoices.status',
            'documents.uploadedBy',
        ]);

        // Calculate project statistics
        $totalTasks = $project->tasks()->count();
        $completedTasks = $project->tasks()->whereHas('status', function ($q) {
            $q->where('status_name', 'LIKE', '%complete%');
        })->count();

        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        $totalExpenses = $project->expenses()->sum('amount');
        $totalInvoices = $project->invoices()->sum('amount');
        $netProfit = $totalInvoices - $totalExpenses;

        // Task breakdown by status
        $tasksByStatus = $project->tasks()
            ->with('status')
            ->get()
            ->groupBy(function ($task) {
                return $task->status?->status_name ?? 'No Status';
            })
            ->map(function ($tasks) {
                return $tasks->count();
            });

        $html = view('reports.projects.pdf', [
            'project' => [
                'project_id' => $project->project_id,
                'name' => $project->name,
                'description' => $project->description,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status?->status_name ?? 'No Status',
                'client' => $project->client?->name ?? 'No Client',
                'manager' => $project->manager?->name ?? 'Unassigned',
            ],
            'stats' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'completion_rate' => $completionRate,
                'total_expenses' => round($totalExpenses, 2),
                'total_invoices' => round($totalInvoices, 2),
                'net_profit' => round($netProfit, 2),
                'total_documents' => $project->documents()->count(),
            ],
            'tasksByStatus' => $tasksByStatus,
        ])->render();

        $pdf = DomPdf::loadHTML($html);

        return $pdf->download('project-report-'.$project->project_id.'-'.now()->format('Y-m-d').'.pdf');
    }

    public function downloadProjectCsv()
    {
        $user = auth()->user();

        $projectsQuery = Project::with(['status', 'client', 'manager', 'tasks'])
            ->where('company_id', $user->company_id);

        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            $projectsQuery->where('project_manager_id', $user->id);
        }

        $projects = $projectsQuery->get();

        $filename = 'projects-report-'.now()->format('Y-m-d').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($projects) {
            $file = fopen('php://output', 'w');

            // CSV Header
            fputcsv($file, ['Name', 'Client', 'Manager', 'Status', 'Start Date', 'End Date', 'Tasks', 'Completed Tasks', 'Completion Rate']);

            // Data rows
            foreach ($projects as $project) {
                $totalTasks = $project->tasks()->count();
                $completedTasks = $project->tasks()->whereHas('status', function ($q) {
                    $q->where('status_name', 'LIKE', '%complete%');
                })->count();
                $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

                fputcsv($file, [
                    $project->name,
                    $project->client?->name ?? 'N/A',
                    $project->manager?->name ?? 'N/A',
                    $project->status?->status_name ?? 'N/A',
                    $project->start_date,
                    $project->end_date,
                    $totalTasks,
                    $completedTasks,
                    $completionRate.'%',
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
