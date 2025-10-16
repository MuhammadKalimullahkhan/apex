import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useRoute } from "ziggy-js";
import { routes } from "@/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Paginated } from "@/types";

interface NotificationType {
  type_id: number;
  type_name: string;
  created_at: string;
  updated_at: string;

  company: any;
  entry_user: any;
}

export default function Index() {
  const route = useRoute();
  const { notification_types } = usePage<{ notification_types: Paginated<NotificationType> }>().props;

  console.log(notification_types);

  const columns: ColumnDef<NotificationType>[] = [
    { accessorKey: "type_id", header: "ID" },
    { accessorKey: "type_name", header: "Type Name" },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => row.original.company?.company_name || "—",
    },
    {
      accessorKey: "entry_user",
      header: "Created By",
      cell: ({ row }) => row.original.entry_user?.name || "—",
    },
    { accessorKey: "created_at", header: "Created At" },
    {
      header: "Actions",
      cell: ({ row }) => (
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
              <Link href={route(routes.notificationsTypes.edit, { id: row.original.type_id })}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link
                href={route(routes.notificationsTypes.destroy, { id: row.original.type_id })}
                method="delete"
                as="button"
                className="w-full"
              >
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ title: "Notification Types", href: route(routes.notifications.index) }]}>
      <Head title="Notification Types" />

      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Notification Types</h1>
          <Link href={route(routes.notificationsTypes.create)}>
            <Button>Create Notification Type</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={notification_types.data}
          pagination={{
            currentPage: notification_types.current_page,
            lastPage: notification_types.last_page,
            links: notification_types.links,
          }}
          searchKey="type_name"
        />
      </div>
    </AppLayout>
  );
}
