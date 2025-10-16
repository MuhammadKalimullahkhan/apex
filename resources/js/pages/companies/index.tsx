import React from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useRoute } from "ziggy-js"
import { routes } from "@/constants/routes"
import { Paginated } from "@/types"

interface Company {
  company_id: number
  company_name: string
  registration_number?: string
  location?: string
  business_email: string
  website?: string
  created_at: string
}

export default function Index() {
  const route = useRoute()
  const { companies } = usePage<{ companies: Paginated<Company> }>().props

  const columns: ColumnDef<Company>[] = [
    { accessorKey: "company_id", header: "ID" },
    { accessorKey: "company_name", header: "Company Name" },
    { accessorKey: "registration_number", header: "Registration No." },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "business_email", header: "Business Email" },
    { accessorKey: "website", header: "Website" },
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
              <Link href={route(routes.companies.edit, { id: row.original.company_id })}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link
                href={route(routes.companies.destroy, { id: row.original.company_id })}
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
  ]

  return (
    <AppLayout breadcrumbs={[{ title: "Companies", href: "/companies" }]}>
      <Head title="Companies" />

      <div className="page-wrapper">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Companies</h1>
          <Link href={route(routes.companies.create)}>
            <Button>Create Company</Button>
          </Link>
        </div>

        <DataTable columns={columns} data={companies.data} searchKey="company_name" pagination={{
            currentPage: companies.current_page,
            lastPage: companies.last_page,
            links: companies.links,
          }} />
      </div>
    </AppLayout>
  )
}
