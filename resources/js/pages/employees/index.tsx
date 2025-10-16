import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Employee, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Employees", href: "/employees" },
]

const Employees = () => {
  const route = useRoute();
  const { users } = usePage<{ users: Paginated<Employee> }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Employees" />
      <div className="page-wrapper">

        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Employees</h1>
          <Link href={route(routes.employees.create)}>
            <Button>Add Employee</Button>
          </Link>
        </div>


        <DataTable
          columns={columns}
          data={users.data}
          pagination={{
            currentPage: users.current_page,
            lastPage: users.last_page,
            links: users.links,
          }}
          searchKey="name"
        />
      </div>
    </AppLayout>
  )
}

export default Employees