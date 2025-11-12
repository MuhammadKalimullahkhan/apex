import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useForm, router } from "@inertiajs/react"
import { MoreHorizontal } from "lucide-react"
import { route, useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"

export interface Task {
  task_id: number
  name: string
  description?: string
  due_date?: string
  priority?: string
  project?: { project_id: number; name: string }
  assignee?: { id: number; name: string }
  status?: { status_id: number; status_name: string }
}

export const columns: ColumnDef<Task>[] = [
  { accessorKey: "task_id", header: "ID" },
  { accessorKey: "name", header: "Task Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "due_date", header: "Due Date" },
  {
    accessorKey: "project.name",
    header: "Project",
    cell: ({ row }) => row.original.project?.name ?? "—",
  },
  {
    accessorKey: "assignee.name",
    header: "Assigned To",
    cell: ({ row }) => row.original.assignee?.name ?? "—",
  },
  {
    accessorKey: "status.status_name",
    header: "Status",
    cell: ({ row, table }) => {
      const currentStatus = row.original.status?.status_name ?? "—"
      const statuses = table.options.meta?.statuses as any[] | undefined
      
      if (!statuses || statuses.length === 0) {
        return <span>{currentStatus}</span>
      }

      const handleStatusChange = (newStatusId: string) => {
        router.put(route(routes.tasks.update, row.original.task_id), {
          status_id: parseInt(newStatusId),
        }, {
          preserveScroll: true,
        })
      }

      return (
        <Select
          value={row.original.status?.status_id?.toString()}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={currentStatus} />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.status_id} value={status.status_id.toString()}>
                {status.status_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
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
              <Link href={route(routes.tasks.show, { id: row.original.task_id })}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={route(routes.tasks.edit, { id: row.original.task_id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link href={route(routes.tasks.destroy, { id: row.original.task_id })} method="delete" as="button" className="w-full">
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
