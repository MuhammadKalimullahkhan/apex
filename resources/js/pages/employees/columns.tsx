import { Badge } from "@/components/ui/badge"
import { Employee } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.role_name",
    header: "Role",
    cell: ({ row }) => {
      const value = row.original.role?.role_name;
      return (
        <Badge variant={"secondary"}>
          {value}
        </Badge>
      )
    },
  },
  {
    accessorKey: "email_verified_at",
    header: "Email Verification",
    cell: ({ row }) => {
      const value = row.getValue("email_verified_at") as string | null
      return (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Verified" : "Not Verified"}
        </Badge>
      )
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const route = useRoute();

      const employee = row.original as Employee
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
              <Link href={route(routes.employees.show, {id: employee.id})}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={route(routes.employees.edit, { id: employee.id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              asChild
            >
              <Link href={route(routes.employees.destroy, { id: employee.id })} method="delete" as="button">
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
