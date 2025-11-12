import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Tasks", href: "/tasks" },
]

const Tasks = () => {
  const route = useRoute()
  const { tasks, statuses } = usePage<{ tasks: Paginated<any>, statuses: any[] }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tasks" />
      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Link href={route(routes.tasks.create)}>
            <Button>Add Task</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={tasks.data}
          pagination={{
            currentPage: tasks.current_page,
            lastPage: tasks.last_page,
            links: tasks.links,
          }}
          searchKey="name"
          meta={{ statuses }}
        />
      </div>
    </AppLayout>
  )
}

export default Tasks
