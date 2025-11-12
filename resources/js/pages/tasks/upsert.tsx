import React from "react"
import { useForm, Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"

interface Task {
  task_id?: number
  name: string
  description?: string
  due_date?: string
  priority?: string
  project_id?: number
  assigned_to?: number
  status_id?: number
  company_id?: number
}

const priorities = [
  {name: 'Low', label: "Low"},
  {name: 'Medium', label: "Medium"},
  {name: 'High', label: "High"},
];
export default function Upsert({
  task,
  projects,
  statuses,
  users,
  companies,
}: {
  task?: Task
  projects: { project_id: number; name: string }[]
  statuses: { status_id: number; status_name: string }[]
  users: { id: number; name: string }[]
  companies: { company_id: number; company_name: string }[]
}) {
  const isEdit = !!task
  const route = useRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    name: task?.name ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ?? "",
    priority: task?.priority ?? "",
    project_id: task?.project_id ?? (projects.length ? projects[0].project_id : ""),
    assigned_to: task?.assigned_to ?? (users.length ? users[0].id : ""),
    status_id: task?.status_id ?? (statuses.length ? statuses[0].status_id : ""),
    company_id: task?.company_id ?? (companies.length ? companies[0].company_id : ""),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route(routes.tasks.update, task?.task_id))
    } else {
      post(route(routes.tasks.store))
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Tasks", href: route("tasks.index") },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Task`} />
      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Task" : "Create Task"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={data.description ?? ""} onChange={(e) => setData("description", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={data.priority ?? ""} onValueChange={(e) => setData("priority", e)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>

              {priorities.map((p) => (
                <SelectItem key={p.name} value={String(p.name)}>
                  {p.label}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input type="date" id="due_date" value={data.due_date ?? ""} onChange={(e) => setData("due_date", e.target.value)} />
          </div>

          <div>
            <Label>Project</Label>
            <Select value={String(data.project_id)} onValueChange={(val) => setData("project_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>

              {projects.map((p) => (
                <SelectItem key={p.project_id} value={String(p.project_id)}>
                  {p.name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assigned To</Label>
            <Select value={String(data.assigned_to)} onValueChange={(val) => setData("assigned_to", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>

              {users.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={String(data.status_id)} onValueChange={(val) => setData("status_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>

              {statuses.map((s) => (
                <SelectItem key={s.status_id} value={String(s.status_id)}>
                  {s.status_name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Company</Label>
            <Select value={String(data.company_id)} onValueChange={(val) => setData("company_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>

              {companies.map((c) => (
                <SelectItem key={c.company_id} value={String(c.company_id)}>
                  {c.company_name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={processing}>{isEdit ? "Update" : "Create"}</Button>
        </form>
      </div>
    </AppLayout>
  )
}
