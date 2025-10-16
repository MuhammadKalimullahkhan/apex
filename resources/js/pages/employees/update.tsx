import React from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Employee as BaseEMP } from "@/types"
import { Switch } from "@/components/ui/switch"

interface Role {
    role_id: number
    role_name: string
}

interface Employee extends BaseEMP {
    role_id?: number;
}

export default function EmployeeUpdate() {
    const { employee, roles, errors } = usePage<{
        employee?: Employee
        roles: Role[]
        errors: Record<string, string>
    }>().props

    const { data, setData, put, processing } = useForm({
        name: employee?.name || "",
        email: employee?.email || "",
        role_id: employee?.role_id || "",
        email_verified: !!employee?.email_verified_at,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        put(`/employees/${employee?.id}`);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: "/" },
        { title: "Employees", href: "/employees" },
        { title: "Edit Employee", href: "" },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"Edit Employee"} />

            <div className="page-wrapper">
                <h1 className="text-2xl font-bold mb-6">
                    {"Edit Employee"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={String(data.role_id)}
                            onValueChange={(val) => setData("role_id", Number(val))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.role_id} value={String(role.role_id)}>
                                        {role.role_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role_id && (
                            <p className="text-sm text-red-600">{errors.role_id}</p>
                        )}
                    </div>

                    {/* Email Verified */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email_verified">Email Verified</Label>
                        <Switch
                            id="email_verified"
                            checked={data.email_verified}
                            onCheckedChange={(val) => setData("email_verified", val)}
                        />
                    </div>


                    {/* Submit */}
                    <Button type="submit" disabled={processing}>
                        Update
                    </Button>
                </form>
            </div>
        </AppLayout>
    )
}
