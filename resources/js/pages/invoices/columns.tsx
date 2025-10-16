import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"
import { MoreHorizontal } from "lucide-react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export interface Invoice {
  invoice_id: number
  amount: number
  due_date: string
  project?: { name: string }
  client?: { name: string }
  status?: { status_name: string }
  company?: { company_name: string }
}

export const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "invoice_id", header: "ID" },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => row.original.client?.name ?? "—",
  },
  {
    accessorKey: "project.name",
    header: "Project",
    cell: ({ row }) => row.original.project?.name ?? "—",
  },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "due_date", header: "Due Date" },
  {
    accessorKey: "status.status_name",
    header: "Status",
    cell: ({ row }) => row.original.status?.status_name ?? "—",
  },
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
              <Link href={route(routes.invoices.edit, { id: row.original.invoice_id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link
                href={route(routes.invoices.destroy, { id: row.original.invoice_id })}
                method="delete"
                as="button"
                className="w-full"
              >
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
