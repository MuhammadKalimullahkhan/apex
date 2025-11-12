import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head, Link, router, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { route, useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { useRef } from "react"
import { Download, Upload, Trash2, Calendar, User, FolderKanban, FileText } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Tasks", href: "/tasks" },
  { title: "Task Details", href: "#" },
]

interface Task {
  task_id: number
  name: string
  description?: string
  due_date?: string
  priority?: string
  project?: { project_id: number; name: string }
  assignee?: { id: number; name: string }
  status?: { status_id: number; status_name: string }
  company?: { company_id: number; company_name: string }
  documents?: Array<{
    id: number
    file_name: string
    file_path: string
    mime_type?: string
    created_at: string
    uploaded_by?: { id: number; name: string }
  }>
}

interface ShowTaskProps {
  task: Task
}

export default function ShowTask({ task }: ShowTaskProps) {
  const routeObj = useRoute()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, setData, post, delete: deleteDocument, processing } = useForm({
    file: null as File | null,
  })

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.file) {
      post(`/tasks/${task.task_id}/documents`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setData('file', null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('file', e.target.files[0])
    }
  }

  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(`/documents/${documentId}`, {
        preserveScroll: true,
      })
    }
  }

  const downloadDocument = (documentId: string) => {
    window.location.href = `/documents/${documentId}/download`
  }

  const getPriorityColor = (priority?: string) => {
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Task: ${task.name}`} />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{task.name}</h1>
            <p className="text-muted-foreground mt-1">{task.description || 'No description'}</p>
          </div>
          <Link href={route(routes.tasks.edit, { id: task.task_id })}>
            <Button>Edit Task</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Task Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Information about this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3">
                  <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Project</p>
                    <p className="text-sm text-muted-foreground">{task.project?.name || 'No project'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">{task.assignee?.name || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">{task.due_date || 'No due date'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Priority</p>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Not set'}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Status</p>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {task.status?.status_name || 'No status'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>Code and files shared on this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Form */}
              <form onSubmit={handleFileSubmit}>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                  <Button type="submit" disabled={processing || !data.file} size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    {processing ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              </form>

              {/* Documents List */}
              <div className="space-y-2 mt-4">
                {task.documents && task.documents.length > 0 ? (
                  task.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.uploaded_by?.name} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadDocument(doc.id.toString())}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

