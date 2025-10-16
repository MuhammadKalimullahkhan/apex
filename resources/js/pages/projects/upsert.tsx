import React from "react"
import { useForm, Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Project {
  project_id?: number
  name: string
  description?: string
  start_date: string
  end_date?: string
  status_id?: number
  project_manager_id?: number
  client_id?: number
  company_id?: number
}

export default function Upsert({
  project,
  companies,
  clients,
  statuses,
  users,
}: {
  project?: Project
  companies: { company_id: number; company_name: string }[]
  clients: { client_id: number; name: string }[]
  statuses: { status_id: number; status_name: string }[]
  users: { id: number; name: string }[]
}) {
  const isEdit = !!project
  const route = useRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    name: project?.name ?? "",
    description: project?.description ?? "",
    start_date: project?.start_date ?? "",
    end_date: project?.end_date ?? "",
    status_id: project?.status_id ?? (statuses.length ? statuses[0].status_id : ""),
    project_manager_id: project?.project_manager_id ?? (users.length ? users[0].id : ""),
    client_id: project?.client_id ?? (clients.length ? clients[0].client_id : ""),
    company_id: project?.company_id ?? (companies.length ? companies[0].company_id : ""),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route(routes.projects.update, project?.project_id))
    } else {
      post(route(routes.projects.store))
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Projects", href: route("projects.index") },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Project`} />
      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Project" : "Create Project"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={data.description ?? ""} onChange={(e) => setData("description", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input type="date" id="start_date" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} />
            {errors.start_date && <p className="text-red-600">{errors.start_date}</p>}
          </div>

          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input type="date" id="end_date" value={data.end_date ?? ""} onChange={(e) => setData("end_date", e.target.value)} />
            {errors.end_date && <p className="text-red-600">{errors.end_date}</p>}
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
            <Label>Project Manager</Label>
            <Select value={String(data.project_manager_id)} onValueChange={(val) => setData("project_manager_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project Manager" />
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
            <Label>Client</Label>
            <Select value={String(data.client_id)} onValueChange={(val) => setData("client_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>

              {clients.map((c) => (
                <SelectItem key={c.client_id} value={String(c.client_id)}>
                  {c.name}
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

              {companies.map((co) => (
                <SelectItem key={co.company_id} value={String(co.company_id)}>
                  {co.company_name}
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
