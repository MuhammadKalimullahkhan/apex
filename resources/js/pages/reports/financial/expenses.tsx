import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, DollarSign, FileText, FolderKanban } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reports", href: "#" },
  { title: "Financial Reports", href: "/reports/financial" },
  { title: "Expenses Report", href: "/reports/financial/expenses" },
]

interface Expense {
  expense_id: number
  name: string
  amount: number
  date: string
  project: string
}

interface Props {
  expenses: Expense[]
  stats: {
    total: number
    count: number
    average: number
  }
  expensesByProject: Array<{
    project: string
    total: number
    count: number
  }>
}

const columns: ColumnDef<Expense>[] = [
  { 
    accessorKey: "name", 
    header: "Expense Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    )
  },
  { 
    accessorKey: "project", 
    header: "Project",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.project}</span>
  },
  { 
    accessorKey: "amount", 
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-red-600">${row.original.amount}</span>
    )
  },
  { 
    accessorKey: "date", 
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.date).toLocaleDateString()}
      </span>
    )
  },
]

export default function ExpensesReport({ expenses, stats, expensesByProject }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Expenses Report" />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Expenses Report</h1>
            <p className="text-muted-foreground mt-1">
              Detailed breakdown of all expenses
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total}</div>
              <p className="text-xs text-muted-foreground">All expenses</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Count</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.count}</div>
              <p className="text-xs text-muted-foreground">Expense records</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
              <Receipt className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.average}</div>
              <p className="text-xs text-muted-foreground">Per expense</p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses by Project and All Expenses */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                By Project
              </CardTitle>
              <CardDescription>Expenses grouped by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expensesByProject.length > 0 ? (
                  expensesByProject.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{item.project}</p>
                        <p className="text-xs text-muted-foreground">{item.count} expenses</p>
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        ${item.total}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No expenses</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>Complete expense listing</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={expenses}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

