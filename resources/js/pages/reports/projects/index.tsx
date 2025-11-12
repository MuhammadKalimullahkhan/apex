import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, TrendingUp, CheckCircle, Calendar, Download } from "lucide-react"
import { route } from "ziggy-js"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reports", href: "#" },
  { title: "Project Reports", href: "/reports/projects" },
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
  total_tasks: number
  completed_tasks: number
  completion_rate: number
  days_remaining: number | null
}

interface Props {
  projects: Project[]
  statuses: Array<{ status_id: number; status_name: string }>
}

const columns: ColumnDef<Project>[] = [
  { 
    accessorKey: "name", 
    header: "Project Name",
    cell: ({ row }) => (
      <Link 
        href={route('reports.projects.show', { project: row.original.project_id })}
        className="font-medium text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    )
  },
  { 
    accessorKey: "client", 
    header: "Client",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.client}</span>
  },
  { 
    accessorKey: "manager", 
    header: "Manager",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.manager}</span>
  },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => (
      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {row.original.status}
      </span>
    )
  },
  { 
    accessorKey: "completion_rate", 
    header: "Completion",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${row.original.completion_rate}%` }}
          />
        </div>
        <span className="text-sm font-medium">{row.original.completion_rate}%</span>
      </div>
    )
  },
  { 
    accessorKey: "total_tasks", 
    header: "Tasks",
    cell: ({ row }) => (
      <span>{row.original.completed_tasks}/{row.original.total_tasks}</span>
    )
  },
  { 
    accessorKey: "end_date", 
    header: "Deadline",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.end_date || 'No deadline'}
      </span>
    )
  },
]

export default function ProjectReports({ projects, statuses }: Props) {
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status?.toLowerCase().includes('progress')).length
  const completedProjects = projects.filter(p => p.status?.toLowerCase().includes('complete')).length
  const avgCompletionRate = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.completion_rate, 0) / projects.length)
    : 0

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Project Reports" />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Project Reports</h1>
            <p className="text-muted-foreground mt-1">
              Overview and analytics for all projects
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = route('reports.projects.csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">All projects</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects}</div>
              <p className="text-xs text-muted-foreground">Finished</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">Average rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>Detailed project listing and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={projects}
              searchKey="name"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

