import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Expenses", href: "/expenses" },
]

const Expenses = () => {
  const route = useRoute()
  const { expenses } = usePage<{ expenses: Paginated<any> }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Expenses" />
      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <Link href={route(routes.expenses.create)}>
            <Button>Add Expense</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={expenses.data}
          pagination={{
            currentPage: expenses.current_page,
            lastPage: expenses.last_page,
            links: expenses.links,
          }}
          searchKey="name"
        />
      </div>
    </AppLayout>
  )
}

export default Expenses
