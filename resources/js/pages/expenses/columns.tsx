import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"
import { MoreHorizontal } from "lucide-react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export interface Expense {
  expense_id: number
  name: string
  amount: number
  date: string
  project?: { project_id: number; name: string }
  company?: { company_id: number; company_name: string }
}

export const columns: ColumnDef<Expense>[] = [
  { accessorKey: "expense_id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "project.name",
    header: "Project",
    cell: ({ row }) => row.original.project?.name ?? "—",
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
              <Link href={route(routes.expenses.edit, { id: row.original.expense_id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link
                href={route(routes.expenses.destroy, { id: row.original.expense_id })}
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
