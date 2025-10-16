import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Employee } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { useRoute} from 'ziggy-js';

export default function EmployeeView() {
    const route = useRoute();
  const { user:employee } = usePage<{ user: Employee }>().props

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/" },
    { title: "Employees", href: "/employees" },
    { title: "View Employee", href: "" },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Employee: ${employee?.name}`} />

      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">
          Employee Details
        </h1>

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>{employee?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">ID:</span> {employee?.id}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {employee?.email}
            </div>
            <div>
              <span className="font-semibold">Role:</span>{" "}
              {employee.role ? employee?.role?.role_name : "—"}
            </div>
            <div>
              <span className="font-semibold">Email Verification:</span>{" "}
              {employee?.email_verified_at ? (
                <Badge variant="default">Verified</Badge>
              ) : (
                <Badge variant="destructive">Not Verified</Badge>
              )}
            </div>
            <div>
              <span className="font-semibold">Created At:</span>{" "}
              {employee?.created_at}
            </div>
            <div>
              <span className="font-semibold">Updated At:</span>{" "}
              {employee?.updated_at}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={route('employees.index')}>Back</Link>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
