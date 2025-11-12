import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FolderKanban, CheckCircle, AlertCircle, Timer, Target, DollarSign, FileText, UserCheck, Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface BaseProps {
  userRole?: string;
  stats: Record<string, any>;
  notifications: {
    message: string;
    is_read: boolean;
    created_at: string;
  }[];
}

interface DeveloperProps extends BaseProps {
  stats: {
    assignedTasks: number;
    completedTasks: number;
    completionRate: number;
  };
  recentTasks: {
    task_id: number;
    name: string;
    priority: string;
    due_date: string;
    status: string;
    project: string;
  }[];
}

interface ProjectManagerProps extends BaseProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    teamTasks: number;
    overdueTasks: number;
  };
  recentProjects: {
    project_id: number;
    name: string;
    status_id: number;
    end_date: string;
    status_name: string;
  }[];
  overdueTasksList: {
    task_id: number;
    name: string;
    priority: string;
    due_date: string;
    assignee: string;
    project: string;
  }[];
}

interface AdminProps extends BaseProps {
  stats: {
    projects: number;
    employees: number;
    tasks: number;
  };
  recentProjects: {
    project_id: number;
    name: string;
    status_id: number;
    end_date: string;
  }[];
}

interface HRProps extends BaseProps {
  stats: {
    totalEmployees: number;
    activeUsers: number;
    totalExpenses: number;
    totalExpenseAmount: number;
  };
  recentEmployees: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }[];
}

interface FinanceManagerProps extends BaseProps {
  stats: {
    totalExpenses: number;
    totalExpenseAmount: number;
    totalInvoices: number;
    totalInvoiceAmount: number;
    unpaidInvoices: number;
  };
  recentExpenses: {
    expense_id: number;
    name: string;
    amount: number;
    date: string;
    project: string;
  }[];
  recentInvoices: {
    invoice_id: number;
    amount: number;
    due_date: string;
    status: string;
    client: string;
    project: string;
  }[];
}

type DashboardProps = DeveloperProps & ProjectManagerProps & AdminProps & HRProps & FinanceManagerProps;

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const props = usePage<{props: DashboardProps}>().props;
  const { userRole, stats, notifications } = props;

  // Developer Dashboard
  if (userRole === 'developer') {
    const devProps = props as DeveloperProps;
    
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Developer Dashboard" />
        <div className="page-wrapper">
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.assignedTasks}</div>
                <p className="text-xs text-muted-foreground">Total tasks assigned to you</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                <Target className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" /> Completed
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Timer className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">Your task completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks + Notifications */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Upcoming and assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {devProps.recentTasks && devProps.recentTasks.length > 0 ? (
                    devProps.recentTasks.map((task) => (
                      <div key={task.task_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{task.name}</p>
                          <p className="text-xs text-muted-foreground">{task.project}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-muted-foreground">{task.status}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {task.due_date}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks assigned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>📢</span>
                        <div className="flex-1">
                          <p>{n.message}</p>
                          <span className="text-xs text-muted-foreground">{n.created_at}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Project Manager Dashboard
  if (userRole === 'project manager') {
    const pmProps = props as ProjectManagerProps;
    
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Project Manager Dashboard" />
        <div className="page-wrapper">
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">Projects managed</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Tasks</CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.teamTasks}</div>
                <p className="text-xs text-muted-foreground">Total team tasks</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overdueTasks}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects + Overdue Tasks + Notifications */}
          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>Recently managed projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pmProps.recentProjects && pmProps.recentProjects.length > 0 ? (
                    pmProps.recentProjects.map((project) => (
                      <div key={project.project_id} className="p-3 border rounded-lg">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{project.status_name || project.status_id}</p>
                        <p className="text-xs text-muted-foreground">{project.end_date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No projects yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overdue Tasks</CardTitle>
                <CardDescription>Tasks past deadline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pmProps.overdueTasksList && pmProps.overdueTasksList.length > 0 ? (
                    pmProps.overdueTasksList.map((task) => (
                      <div key={task.task_id} className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                        <p className="font-medium text-sm">{task.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'High' ? 'bg-red-600 text-white' :
                            task.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No overdue tasks</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>📢</span>
                        <div className="flex-1">
                          <p>{n.message}</p>
                          <span className="text-xs text-muted-foreground">{n.created_at}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // HR Dashboard
  if (userRole === 'hr') {
    const hrProps = props as HRProps;
    
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="HR Dashboard" />
        <div className="page-wrapper">
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">All employees</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <UserCheck className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Verified employees</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <Receipt className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalExpenses}</div>
                <p className="text-xs text-muted-foreground">Expense records</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Expense Amount</CardTitle>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalExpenseAmount}</div>
                <p className="text-xs text-muted-foreground">Total expenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Employees + Notifications */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Employees</CardTitle>
                <CardDescription>Latest employee registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hrProps.recentEmployees && hrProps.recentEmployees.length > 0 ? (
                    hrProps.recentEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {employee.created_at}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No employees yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>📢</span>
                        <div className="flex-1">
                          <p>{n.message}</p>
                          <span className="text-xs text-muted-foreground">{n.created_at}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Finance Manager Dashboard
  if (userRole === 'finance manager') {
    const financeProps = props as FinanceManagerProps;
    
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Finance Manager Dashboard" />
        <div className="page-wrapper">
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <Receipt className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalExpenses}</div>
                <p className="text-xs text-muted-foreground">Expense records</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Expense Amount</CardTitle>
                <DollarSign className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalExpenseAmount}</div>
                <p className="text-xs text-muted-foreground">Total spent</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvoices}</div>
                <p className="text-xs text-muted-foreground">Invoice records</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invoice Amount</CardTitle>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalInvoiceAmount}</div>
                <p className="text-xs text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unpaidInvoices}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses + Recent Invoices + Notifications */}
          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Latest expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financeProps.recentExpenses && financeProps.recentExpenses.length > 0 ? (
                    financeProps.recentExpenses.map((expense) => (
                      <div key={expense.expense_id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{expense.name}</p>
                            <p className="text-xs text-muted-foreground">{expense.project}</p>
                            <p className="text-xs text-muted-foreground mt-1">{expense.date}</p>
                          </div>
                          <p className="font-semibold text-red-600">${expense.amount}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No expenses yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financeProps.recentInvoices && financeProps.recentInvoices.length > 0 ? (
                    financeProps.recentInvoices.map((invoice) => (
                      <div key={invoice.invoice_id} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{invoice.client}</p>
                        <p className="text-xs text-muted-foreground">{invoice.project}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            invoice.status.toLowerCase().includes('paid') 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {invoice.status}
                          </span>
                          <p className="font-semibold text-emerald-600">${invoice.amount}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Due: {invoice.due_date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No invoices yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>📢</span>
                        <div className="flex-1">
                          <p>{n.message}</p>
                          <span className="text-xs text-muted-foreground">{n.created_at}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Admin/Default Dashboard
  const adminProps = props as AdminProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="page-wrapper">
        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" /> Active Projects
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.employees}</div>
              <p className="text-xs text-muted-foreground">All employees</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasks}</div>
              <p className="text-xs text-muted-foreground">Assigned across projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects + Notifications */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adminProps.recentProjects && adminProps.recentProjects.length > 0 ? (
                  adminProps.recentProjects.map((project) => (
                    <div key={project.project_id} className="p-3 border rounded-lg">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{project.status_id}</p>
                      <p className="text-xs text-muted-foreground">{project.end_date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No projects</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map(
                    (n: { message: string; created_at: string }, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>📢</span>
                        <div className="flex-1">
                        <p>{n.message}</p>
                        <span className="text-xs text-muted-foreground">{n.created_at}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No notifications</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
