import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useRoute } from "ziggy-js";
import { routes } from "@/constants/routes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Paginated } from "@/types";

interface Role {
    role_id: number;
    role_name: string;
    permissions: unknown;
    created_at: string;
}

export default function Index() {
    const route = useRoute();
    const { roles } = usePage<{ roles: Paginated<Role> }>().props;

    console.log(roles)

    const columns: ColumnDef<Role>[] = [
        { accessorKey: "role_id", header: "ID" },
        { accessorKey: "role_name", header: "Role Name" },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => {
                const value = row.getValue("permissions") as unknown;
                if (Array.isArray(value)) {
                    return value.length ? value.join(", ") : "—";
                }
                if (value && typeof value === "object") {
                    try { return JSON.stringify(value); } catch { return "—"; }
                }
                return (value as string) ?? "—";
            },
        },
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
                            <Link href={route(routes.roles.edit, { id: row.original.role_id })}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            asChild
                        >
                            <Link href={route(routes.roles.destroy, { id: row.original.role_id })} method="delete" as="button" className="w-full">
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: "Roles", href: "/roles" }]}>
            <Head title="Roles" />

            <div className="page-wrapper">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <Link href={route("roles.create")}>
                        <Button>Create Role</Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={roles.data} searchKey="role_name" pagination={{
                    currentPage: roles.current_page,
                    lastPage: roles.last_page,
                    links: roles.links,
                }} />
            </div>
        </AppLayout>
    );
}
