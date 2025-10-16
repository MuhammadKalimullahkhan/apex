import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Invoices", href: "/invoices" },
]

const Invoices = () => {
  const route = useRoute()
  const { invoices } = usePage<{ invoices: Paginated<any> }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Invoices" />
      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Link href={route(routes.invoices.create)}>
            <Button>Add Invoice</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={invoices.data}
          pagination={{
            currentPage: invoices.current_page,
            lastPage: invoices.last_page,
            links: invoices.links,
          }}
          searchKey="name"
        />
      </div>
    </AppLayout>
  )
}

export default Invoices
