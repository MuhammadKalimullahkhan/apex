import React from "react"
import { useForm, Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface Expense {
  expense_id?: number
  name: string
  amount: number
  date: string
  project_id?: number
  company_id?: number
}

export default function Upsert({
  expense,
  projects,
  companies,
}: {
  expense?: Expense
  projects: { project_id: number; name: string }[]
  companies: { company_id: number; company_name: string }[]
}) {
  const isEdit = !!expense
  const route = useRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    name: expense?.name ?? "",
    amount: expense?.amount ?? 0,
    date: expense?.date ?? "",
    project_id: expense?.project_id ?? (projects.length ? projects[0].project_id : ""),
    company_id: expense?.company_id ?? (companies.length ? companies[0].company_id : ""),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route(routes.expenses.update, expense?.expense_id))
    } else {
      post(route(routes.expenses.store))
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Expenses", href: route("expenses.index") },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Expense`} />
      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Expense" : "Create Expense"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
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
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" value={data.date} onChange={(e) => setData("date", e.target.value)} />
            {errors.date && <p className="text-red-600">{errors.date}</p>}
          </div>

          <div>
            <Label>Project</Label>
            <Select
              value={String(data.project_id)}
              onValueChange={(val) => setData("project_id", Number(val))}>
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
            <Label>Company</Label>
            <Select
              value={String(data.company_id)}
              onValueChange={(val) => setData("company_id", Number(val))}>
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

          <Button type="submit" disabled={processing}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
