import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"
import { MoreHorizontal } from "lucide-react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export interface Project {
  project_id: number
  name: string
  description?: string
  start_date: string
  end_date?: string
  status?: { status_id: number; status_name: string }
  client?: { client_id: number; name: string }
  company?: { company_id: number; company_name: string }
  manager?: { id: number; name: string }
}

export const columns: ColumnDef<Project>[] = [
  { accessorKey: "project_id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "start_date", header: "Start Date" },
  { accessorKey: "end_date", header: "End Date" },
  {
    accessorKey: "status.status_name",
    header: "Status",
    cell: ({ row }) => row.original.status?.status_name ?? "—",
  },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => row.original.client?.name ?? "—",
  },
  {
    accessorKey: "manager.name",
    header: "Manager",
    cell: ({ row }) => row.original.manager?.name ?? "—",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const route = useRoute()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={route(routes.projects.edit, { id: row.original.project_id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link href={route(routes.projects.destroy, { id: row.original.project_id })} method="delete" as="button" className="w-full">
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
