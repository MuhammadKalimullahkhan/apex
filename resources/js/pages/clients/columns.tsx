import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"
import { MoreHorizontal } from "lucide-react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export interface Client {
  client_id: number
  name: string
  contact_number?: string
  address?: string
  company?: { company_id: number; company_name: string }
  created_at: string
}

export const columns: ColumnDef<Client>[] = [
  { accessorKey: "client_id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "contact_number", header: "Contact Number" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "company.company_name",
    header: "Company",
    cell: ({ row }) => row.original.company?.company_name ?? "—",
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
              <Link href={route(routes.clients.edit, { id: row.original.client_id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link href={route(routes.clients.destroy, { id: row.original.client_id })} method="delete" as="button" className="w-full">
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
