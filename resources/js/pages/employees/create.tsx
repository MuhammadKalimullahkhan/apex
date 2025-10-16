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
import { BreadcrumbItem } from "@/types"

interface Role {
    role_id: number
    role_name: string
}

interface Employee {
    id: number
    name: string
    email: string
    password:string;
    role_id?: string
}

export default function EmployeeCreate() {
    const { employee, roles, errors } = usePage<{
        employee?: Employee
        roles: Role[]
        errors: Record<string, string>
    }>().props

    const { data, setData, post, processing } = useForm({
        name: employee?.name || "",
        email: employee?.email || "",
        password: employee?.password || "",
        password_confirmation: employee?.password || "",
        role_id: employee?.role_id || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post("/employees");
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: "/" },
        { title: "Employees", href: "/employees" },
        { title: "Create Employee", href: "" },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"Create Employee"} />

            <div className="page-wrapper">
                <h1 className="text-2xl font-bold mb-6">
                    {"Create Employee"}
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

                    {/* Password */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* confirmed Password */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                        />
                        {errors.password_confirmed && (
                            <p className="text-sm text-red-600">{errors.password_confirmed}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={String(data.role_id)}
                            onValueChange={(val) => setData("role_id", val)}
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

                    {/* Submit */}
                    <Button type="submit" disabled={processing}>
                        {"Create"}
                    </Button>
                </form>
            </div>
        </AppLayout>
    )
}
