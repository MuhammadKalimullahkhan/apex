import React from "react"
import { useForm, Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invoice {
  invoice_id?: number
  project_id?: number
  client_id?: number
  amount: number
  status_id?: number
  due_date: string
  company_id?: number
}

export default function Upsert({
  invoice,
  projects,
  clients,
  statuses,
  companies,
}: {
  invoice?: Invoice
  projects: { project_id: number; name: string }[]
  clients: { client_id: number; name: string }[]
  statuses: { status_id: number; status_name: string }[]
  companies: { company_id: number; company_name: string }[]
}) {
  const isEdit = !!invoice
  const route = useRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    project_id: invoice?.project_id ?? (projects.length ? projects[0].project_id : ""),
    client_id: invoice?.client_id ?? (clients.length ? clients[0].client_id : ""),
    amount: invoice?.amount ?? 0,
    status_id: invoice?.status_id ?? (statuses.length ? statuses[0].status_id : ""),
    due_date: invoice?.due_date ?? "",
    company_id: invoice?.company_id ?? (companies.length ? companies[0].company_id : ""),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route(routes.invoices.update, invoice?.invoice_id))
    } else {
      post(route(routes.invoices.store))
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Invoices", href: route("invoices.index") },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Invoice`} />
      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Invoice" : "Create Invoice"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label>Client</Label>
            <Select
              value={String(data.client_id)}
              onValueChange={(val) => setData("client_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Client" />
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
            <Label>Project</Label>
            <Select
              value={String(data.project_id)}
              onValueChange={(val) => setData("project_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Project" />
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              value={data.amount}
              onChange={(e) => setData("amount", Number(e.target.value))}
            />
            {errors.amount && <p className="text-red-600">{errors.amount}</p>}
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={String(data.status_id)}
              onValueChange={(val) => setData("status_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Status" />
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
            <Label htmlFor="due_date">Due Date</Label>
            <Input type="date" id="due_date" value={data.due_date} onChange={(e) => setData("due_date", e.target.value)} />
            {errors.due_date && <p className="text-red-600">{errors.due_date}</p>}
          </div>

          <div>
            <Label>Company</Label>
            <Select
              value={String(data.company_id)}
              onValueChange={(val) => setData("company_id", Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Company" />
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

          <Button type="submit" disabled={processing}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
