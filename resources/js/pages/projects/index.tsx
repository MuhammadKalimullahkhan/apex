import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Paginated } from "@/types"
import { Head, usePage, Link } from "@inertiajs/react"
import { DataTable } from "@/components/ui/data-table"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Projects", href: "/projects" },
]

const Projects = () => {
  const route = useRoute()
  const { projects } = usePage<{ projects: Paginated<any> }>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Projects" />
      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link href={route(routes.projects.create)}>
            <Button>Add Project</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={projects.data}
          pagination={{
            currentPage: projects.current_page,
            lastPage: projects.last_page,
            links: projects.links,
          }}
          searchKey="name"
        />
      </div>
    </AppLayout>
  )
}

export default Projects
