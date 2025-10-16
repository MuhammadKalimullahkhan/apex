import React from "react"
import { useForm, Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Client {
  client_id?: number
  name: string
  contact_number?: string
  address?: string
  company_id?: number
}

export default function Upsert({ client, companies }: { client?: Client; companies: { company_id: number; company_name: string }[] }) {
  const isEdit = !!client
  const route = useRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    name: client?.name ?? "",
    contact_number: client?.contact_number ?? "",
    address: client?.address ?? "",
    company_id: client?.company_id ?? (companies.length ? companies[0].company_id : ""),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      put(route(routes.clients.update, client?.client_id))
    } else {
      post(route(routes.clients.store))
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Clients", href: route("clients.index") },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Client`} />
      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Client" : "Create Client"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input id="contact_number" value={data.contact_number ?? ""} onChange={(e) => setData("contact_number", e.target.value)} />
            {errors.contact_number && <p className="text-red-600">{errors.contact_number}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={data.address ?? ""} onChange={(e) => setData("address", e.target.value)} />
            {errors.address && <p className="text-red-600">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="company_id">Company</Label>
             <Select
              value={String(data.company_id)}
              onValueChange={(value) => setData("company_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem
                    key={company.company_id}
                    value={String(company.company_id)}
                  >
                    {company.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-red-600">{errors.company_id}</p>}
          </div>

          <Button type="submit" disabled={processing}>{isEdit ? "Update" : "Create"}</Button>
        </form>
      </div>
    </AppLayout>
  )
}
