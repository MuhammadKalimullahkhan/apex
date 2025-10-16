import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Clients", href: "/clients" },
]

const Clients = () => {
  const route = useRoute()
  const { clients } = usePage<{ clients: Paginated<any> }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clients" />
      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Link href={route(routes.clients.create)}>
            <Button>Add Client</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={clients.data}
          pagination={{
            currentPage: clients.current_page,
            lastPage: clients.last_page,
            links: clients.links,
          }}
          searchKey="name"
        />
      </div>
    </AppLayout>
  )
}

export default Clients
