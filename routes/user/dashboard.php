<?php

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $role = strtolower($user->role->role_name ?? '');

        // Admin Dashboard - show admin dashboard to users with admin role
        if ($user->isAdmin()) {
            return inertia('dashboard', [
                'userRole' => 'admin',
                'stats' => [
                    'projects' => Project::where('company_id', $user->company_id)->count(),
                    'employees' => User::where('company_id', $user->company_id)->count(),
                    'tasks' => Task::where('company_id', $user->company_id)->count(),
                ],
                'recentProjects' => Project::where('company_id', $user->company_id)
                    ->latest()
                    ->take(5)
                    ->get(['project_id', 'name', 'status_id', 'end_date']),
                'notifications' => Notification::latest()
                    ->take(5)
                    ->get(['message', 'is_read', 'created_at']),
            ]);
        }

        // Developer Dashboard - users with tasks.update permission
        if ($user->hasDeveloperPermission() && ! $user->hasProjectManagerPermission()) {
            $assignedTasks = Task::with(['project', 'status'])
                ->where('assigned_to', $user->id)
                ->where('company_id', $user->company_id)
                ->orderBy('due_date', 'asc')
                ->get();

            $completedTasks = $assignedTasks->filter(function ($task) {
                return $task->status
                    && (strtolower($task->status->status_name) === 'complete'
                        || str_contains(strtolower($task->status->status_name), 'complete'));
            })->count();

            $totalTasks = $assignedTasks->count();
            $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

            return inertia('dashboard', [
                'userRole' => 'developer',
                'stats' => [
                    'assignedTasks' => $totalTasks,
                    'completedTasks' => $completedTasks,
                    'completionRate' => $completionRate,
                ],
                'recentTasks' => $assignedTasks->take(10)->map(function ($task) {
                    return [
                        'task_id' => $task->task_id,
                        'name' => $task->name,
                        'priority' => $task->priority,
                        'due_date' => $task->due_date,
                        'status' => $task->status?->status_name,
                        'project' => $task->project?->name,
                    ];
                }),
                'notifications' => Notification::latest()
                    ->where(function ($query) use ($user) {
                        // Notifications for the user or general notifications
                        $query->whereNull('user_id')
                            ->orWhere('user_id', $user->id);
                    })
                    ->take(5)
                    ->get(['message', 'is_read', 'created_at']),
            ]);
        }

        // Project Manager Dashboard - users with projects.manage permission
        if ($user->hasProjectManagerPermission()) {
            $managedProjects = Project::where('project_manager_id', $user->id)
                ->where('company_id', $user->company_id)
                ->get();

            $totalProjects = $managedProjects->count();
            $activeProjects = $managedProjects->filter(function ($project) {
                return $project->status
                    && strtolower($project->status->status_name) === 'in progress';
            })->count();

            $teamTasks = Task::with(['assignee', 'project', 'status'])
                ->whereIn('project_id', $managedProjects->pluck('project_id'))
                ->orderBy('due_date', 'asc')
                ->get();

            $overdueTasks = $teamTasks->filter(function ($task) {
                return $task->due_date && \Carbon\Carbon::parse($task->due_date)->isPast()
                    && $task->status?->status_name !== 'Complete';
            });

            $teamMembers = User::whereIn('id', $teamTasks->pluck('assigned_to'))
                ->get(['id', 'name', 'email']);

            return inertia('dashboard', [
                'userRole' => 'project manager',
                'stats' => [
                    'totalProjects' => $totalProjects,
                    'activeProjects' => $activeProjects,
                    'teamTasks' => $teamTasks->count(),
                    'overdueTasks' => $overdueTasks->count(),
                ],
                'recentProjects' => $managedProjects->take(5)->map(function ($project) {
                    return [
                        'project_id' => $project->project_id,
                        'name' => $project->name,
                        'status_id' => $project->status_id,
                        'end_date' => $project->end_date,
                        'status_name' => $project->status?->status_name,
                    ];
                }),
                'overdueTasksList' => $overdueTasks->take(10)->map(function ($task) {
                    return [
                        'task_id' => $task->task_id,
                        'name' => $task->name,
                        'priority' => $task->priority,
                        'due_date' => $task->due_date,
                        'assignee' => $task->assignee?->name,
                        'project' => $task->project?->name,
                    ];
                }),
                'notifications' => Notification::latest()
                    ->where(function ($query) use ($user) {
                        $query->whereNull('user_id')
                            ->orWhere('user_id', $user->id);
                    })
                    ->take(5)
                    ->get(['message', 'is_read', 'created_at']),
            ]);
        }

        // HR Dashboard - users with users.view permission
        if ($user->hasHRPermission()) {
            $totalEmployees = User::where('company_id', $user->company_id)->count();
            $activeUsers = User::where('company_id', $user->company_id)
                ->whereNotNull('email_verified_at')
                ->count();

            $totalExpenses = Expense::where('company_id', $user->company_id)->count();
            $totalExpenseAmount = Expense::where('company_id', $user->company_id)->sum('amount');

            return inertia('dashboard', [
                'userRole' => 'hr',
                'stats' => [
                    'totalEmployees' => $totalEmployees,
                    'activeUsers' => $activeUsers,
                    'totalExpenses' => $totalExpenses,
                    'totalExpenseAmount' => round($totalExpenseAmount, 2),
                ],
                'recentEmployees' => User::where('company_id', $user->company_id)
                    ->with('role')
                    ->latest()
                    ->take(5)
                    ->get(['id', 'name', 'email', 'created_at'])
                    ->map(function ($employee) {
                        return [
                            'id' => $employee->id,
                            'name' => $employee->name,
                            'email' => $employee->email,
                            'role' => $employee->role?->role_name ?? 'N/A',
                            'created_at' => $employee->created_at,
                        ];
                    }),
                'notifications' => Notification::latest()
                    ->where(function ($query) use ($user) {
                        $query->whereNull('user_id')
                            ->orWhere('user_id', $user->id);
                    })
                    ->take(5)
                    ->get(['message', 'is_read', 'created_at']),
            ]);
        }

        // Finance Manager Dashboard - users with expenses.view and invoices.view permissions
        if ($user->hasFinanceManagerPermission()) {
            $totalExpenses = Expense::where('company_id', $user->company_id)->count();
            $totalExpenseAmount = Expense::where('company_id', $user->company_id)->sum('amount');

            $totalInvoices = Invoice::with(['project', 'client', 'status'])->where('company_id', $user->company_id)->count();
            $totalInvoiceAmount = Invoice::where('company_id', $user->company_id)->sum('amount');

            $unpaidInvoices = Invoice::where('company_id', $user->company_id)
                ->whereHas('status', function ($q) {
                    $q->where('status_name', 'LIKE', '%unpaid%')
                        ->orWhere('status_name', 'LIKE', '%pending%');
                })
                ->count();

            return inertia('dashboard', [
                'userRole' => 'finance manager',
                'stats' => [
                    'totalExpenses' => $totalExpenses,
                    'totalExpenseAmount' => round($totalExpenseAmount, 2),
                    'totalInvoices' => $totalInvoices,
                    'totalInvoiceAmount' => round($totalInvoiceAmount, 2),
                    'unpaidInvoices' => $unpaidInvoices,
                ],
                'recentExpenses' => Expense::where('company_id', $user->company_id)
                    ->with('project')
                    ->latest()
                    ->take(5)
                    ->get(['expense_id', 'name', 'amount', 'date', 'project_id'])
                    ->map(function ($expense) {
                        return [
                            'expense_id' => $expense->expense_id,
                            'name' => $expense->name,
                            'amount' => $expense->amount,
                            'date' => $expense->date,
                            'project' => $expense->project?->name ?? 'N/A',
                        ];
                    }),
                'recentInvoices' => Invoice::where('company_id', $user->company_id)
                    ->with(['project', 'client', 'status'])
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($invoice) {
                        return [
                            'invoice_id' => $invoice->invoice_id,
                            'amount' => $invoice->amount,
                            'due_date' => $invoice->due_date,
                            'status' => $invoice->status?->status_name ?? 'N/A',
                            'client' => $invoice->client?->name ?? 'N/A',
                            'project' => $invoice->project?->name ?? 'N/A',
                        ];
                    }),
                'notifications' => Notification::latest()
                    ->where(function ($query) use ($user) {
                        $query->whereNull('user_id')
                            ->orWhere('user_id', $user->id);
                    })
                    ->take(5)
                    ->get(['message', 'is_read', 'created_at']),
            ]);
        }

        // Admin/Default Dashboard (Fallback)
        return inertia('dashboard', [
            'userRole' => $role,
            'stats' => [
                'projects' => Project::where('company_id', $user->company_id)->count(),
                'employees' => User::where('company_id', $user->company_id)->count(),
                'tasks' => Task::where('company_id', $user->company_id)->count(),
            ],
            'recentProjects' => Project::where('company_id', $user->company_id)
                ->latest()
                ->take(5)
                ->get(['project_id', 'name', 'status_id', 'end_date']),
            'notifications' => Notification::latest()
                ->take(5)
                ->get(['message', 'is_read', 'created_at']),
        ]);
    })->name('dashboard');
});
