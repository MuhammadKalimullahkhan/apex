import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reports", href: "#" },
  { title: "Financial Reports", href: "/reports/financial" },
  { title: "Invoices Report", href: "/reports/financial/invoices" },
]

interface Invoice {
  invoice_id: number
  amount: number
  due_date: string
  client: string
  project: string
  status: string
  is_overdue: boolean
  days_overdue: number
}

interface Props {
  invoices: Invoice[]
  stats: {
    total_amount: number
    total_count: number
    paid_amount: number
    paid_count: number
    unpaid_amount: number
    unpaid_count: number
    overdue_amount: number
    overdue_count: number
  }
}

const columns: ColumnDef<Invoice>[] = [
  { 
    accessorKey: "client", 
    header: "Client",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.client}</span>
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
      <span className="font-semibold text-green-600">${row.original.amount}</span>
    )
  },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const isPaid = row.original.status?.toLowerCase().includes('paid')
      return (
        <span className={`text-xs px-2 py-1 rounded ${
          isPaid
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {row.original.status}
        </span>
      )
    }
  },
  { 
    accessorKey: "due_date", 
    header: "Due Date",
    cell: ({ row }) => (
      <span className={`text-sm ${row.original.is_overdue ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
        {new Date(row.original.due_date).toLocaleDateString()}
      </span>
    )
  },
  { 
    accessorKey: "is_overdue", 
    header: "Overdue",
    cell: ({ row }) => {
      if (row.original.is_overdue) {
        return (
          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {row.original.days_overdue} days
          </span>
        )
      }
      return <span className="text-sm text-muted-foreground">—</span>
    }
  },
]

export default function InvoicesReport({ invoices, stats }: Props) {
  const paymentRate = stats.total_count > 0 
    ? Math.round((stats.paid_count / stats.total_count) * 100) 
    : 0

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Invoices Report" />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Invoices Report</h1>
            <p className="text-muted-foreground mt-1">
              Invoice status and payment analytics
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_amount}</div>
              <p className="text-xs text-muted-foreground">All invoices</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.paid_amount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.paid_count} invoices ({paymentRate}%)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
              <FileText className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.unpaid_amount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unpaid_count} invoices
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.overdue_amount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overdue_count} invoices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Breakdown */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Revenue breakdown by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Paid</span>
                    <span className="text-sm font-semibold text-green-600">
                      ${stats.paid_amount} ({Math.round((stats.paid_amount / stats.total_amount) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stats.paid_amount / stats.total_amount) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Unpaid</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      ${stats.unpaid_amount} ({Math.round((stats.unpaid_amount / stats.total_amount) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(stats.unpaid_amount / stats.total_amount) * 100}%` }}
                    />
                  </div>
                </div>

                {stats.overdue_amount > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-red-600">Overdue</span>
                      <span className="text-sm font-semibold text-red-600">
                        ${stats.overdue_amount} ({Math.round((stats.overdue_amount / stats.total_amount) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(stats.overdue_amount / stats.total_amount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collection Rate</CardTitle>
              <CardDescription>Payment performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl font-bold text-emerald-600 mb-2">
                  {paymentRate}%
                </div>
                <p className="text-muted-foreground">Collection Rate</p>
                <div className="mt-4 text-sm text-center text-muted-foreground">
                  <p>{stats.paid_count} of {stats.total_count} invoices paid</p>
                  <p className="mt-2">
                    ${stats.paid_amount.toLocaleString()} collected of ${stats.total_amount.toLocaleString()} total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Complete invoice listing</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={invoices}
              searchKey="client"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

