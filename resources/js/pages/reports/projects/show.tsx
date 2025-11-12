import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, User, TrendingUp, DollarSign, FileText, Calendar, Target, Download } from "lucide-react"
import { route } from "ziggy-js"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reports", href: "#" },
  { title: "Project Reports", href: "/reports/projects" },
  { title: "Project Details", href: "#" },
]

interface Project {
  project_id: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status: string
  status_id: number
  client: string
  manager: string
}

interface Props {
  project: Project
  stats: {
    total_tasks: number
    completed_tasks: number
    completion_rate: number
    total_expenses: number
    total_invoices: number
    net_profit: number
    total_documents: number
  }
  tasksByStatus: Record<string, number>
  tasksByPriority: Record<string, number>
  recentTasks: Array<{
    task_id: number
    name: string
    priority: string
    status: string
    assignee: string
    due_date?: string
  }>
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function ProjectReportDetail({ project, stats, tasksByStatus, tasksByPriority, recentTasks }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${project.name} - Report`} />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description || 'No description'}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = route('reports.projects.pdf', { project: project.project_id })}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <Target className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_tasks}/{stats.total_tasks}</div>
              <p className="text-xs text-muted-foreground">{stats.completion_rate}% complete</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <DollarSign className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_expenses}</div>
              <p className="text-xs text-muted-foreground">Total spent</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_invoices}</div>
              <p className="text-xs text-muted-foreground">Total invoices</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.net_profit}</div>
              <p className={`text-xs ${stats.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.net_profit >= 0 ? 'Profit' : 'Loss'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Info and Task Breakdown */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Details and team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Project Manager</p>
                  <p className="text-sm text-muted-foreground">{project.manager}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Timeline</p>
                  <p className="text-sm text-muted-foreground">
                    {project.start_date || 'No start date'} → {project.end_date || 'No end date'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Status</p>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {project.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Breakdown</CardTitle>
              <CardDescription>Tasks by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(tasksByStatus).length > 0 ? (
                Object.entries(tasksByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Priority Breakdown and Recent Tasks */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Priority distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(tasksByPriority).length > 0 ? (
                Object.entries(tasksByPriority).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(priority)}`}>
                      {priority}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest 10 tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div key={task.task_id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.status}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>{task.assignee}</p>
                        <p>{task.due_date || 'No deadline'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

