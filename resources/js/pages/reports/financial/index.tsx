import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, FileText, Receipt, BarChart3, Download } from "lucide-react"
import { route } from "ziggy-js"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reports", href: "#" },
  { title: "Financial Reports", href: "/reports/financial" },
]

interface Props {
  summary: {
    total_expenses: number
    total_revenue: number
    net_profit: number
    profit_margin: number
  }
  monthlyTrend: Array<{
    month: string
    expenses: number
    invoices: number
    profit: number
  }>
  expensesByProject: Array<{
    project_id: number
    project_name: string
    total: number
    count: number
  }>
  invoicesByStatus: Array<{
    status_id: number
    status_name: string
    total: number
    count: number
  }>
  overdueInvoices: Array<{
    invoice_id: number
    amount: number
    due_date: string
    client: string
    project: string
    status: string
    days_overdue: number
  }>
}

export default function FinancialReports({ summary, monthlyTrend, expensesByProject, invoicesByStatus, overdueInvoices }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Financial Reports" />
      <div className="page-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Financial Reports</h1>
            <p className="text-muted-foreground mt-1">
              Complete financial overview and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = route('reports.financial.pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => window.location.href = route('reports.financial.csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.total_expenses}</div>
              <p className="text-xs text-muted-foreground">All time expenses</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.total_revenue}</div>
              <p className="text-xs text-muted-foreground">Total invoices</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              {summary.net_profit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${summary.net_profit}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.profit_margin >= 0 ? '+' : ''}{summary.profit_margin}% margin
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueInvoices.length}</div>
              <p className="text-xs text-muted-foreground">Invoices overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend and Top Expenses/Invoices */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
              <CardDescription>Last 6 months overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyTrend.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{month.month}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Revenue: ${month.invoices}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Expenses: ${month.expenses}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${month.profit}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Expenses by Project</CardTitle>
              <CardDescription>Highest spending projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expensesByProject.length > 0 ? (
                  expensesByProject.map((item, index) => (
                    <div key={item.project_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.project_name}</p>
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
        </div>

        {/* Invoices by Status and Overdue Invoices */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoices by Status</CardTitle>
              <CardDescription>Breakdown by payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoicesByStatus.length > 0 ? (
                  invoicesByStatus.map((item) => (
                    <div key={item.status_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.status_name}</p>
                        <p className="text-xs text-muted-foreground">{item.count} invoices</p>
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        ${item.total}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No invoices</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overdue Invoices</CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueInvoices.length > 0 ? (
                  overdueInvoices.map((invoice) => (
                    <div key={invoice.invoice_id} className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{invoice.client}</p>
                        <p className="text-xs text-muted-foreground">{invoice.project}</p>
                        <p className="text-xs text-red-600 mt-1">
                          {invoice.days_overdue} days overdue
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        ${invoice.amount}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No overdue invoices</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Link href={route('reports.financial.expenses')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Expense Report
                </CardTitle>
                <CardDescription>Detailed expense breakdown</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={route('reports.financial.invoices')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Report
                </CardTitle>
                <CardDescription>Invoice status and analytics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={route('reports.projects.index')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project Reports
                </CardTitle>
                <CardDescription>Project analytics and metrics</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

