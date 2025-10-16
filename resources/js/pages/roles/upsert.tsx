import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRoute } from "ziggy-js";
import { routes } from "@/constants/routes";

interface Role {
  role_id?: number;
  role_name: string;
  permissions: string | null;
  company?: any;
}

export default function Upsert({ role, allRoutes = [] }: { role?: Role; allRoutes?: string[] }) {

  console.log(role);


  const isEdit = !!role;

  const route = useRoute();
  const presetPermissions: string[] = (() => {
    if (!role?.permissions) return [];
    try { return JSON.parse(role.permissions as unknown as string) ?? []; } catch { return []; }
  })();

  const { data, setData, post, put, processing, errors } = useForm({
    role_name: role?.role_name ?? "",
    permissions: presetPermissions as string[],
    company: role?.company?.company_name ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      put(route(routes.roles.update, role?.role_id));
    } else {
      post(route(routes.roles.store));
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Roles", href: route(routes.roles.index) },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Role`} />

      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Role" : "Create Role"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="role_name">Role Name</Label>
            <Input
              id="role_name"
              value={data.role_name}
              onChange={(e) => setData("role_name", e.target.value)}
            />
            {errors.role_name && (
              <p className="text-red-600">{errors.role_name}</p>
            )}
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="perm_all"
                  type="checkbox"
                  checked={Array.isArray(data.permissions) && data.permissions.length === allRoutes.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('permissions', allRoutes);
                    } else {
                      setData('permissions', []);
                    }
                  }}
                />
                <Label htmlFor="perm_all">All</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[320px] overflow-auto p-2 border rounded">
                {allRoutes.map((r) => (
                  <label key={r} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(data.permissions) && data.permissions.includes(r)}
                      onChange={(e) => {
                        const current = new Set<string>(Array.isArray(data.permissions) ? data.permissions : []);
                        if (e.target.checked) { current.add(r); } else { current.delete(r); }
                        setData('permissions', Array.from(current));
                      }}
                    />
                    <span className="truncate" title={r}>{r}</span>
                  </label>
                ))}
              </div>

              {errors.permissions && (
                <p className="text-red-600">{errors.permissions as unknown as string}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="company_id">Company</Label>
            <Input
              id="company_id"
              value={data.company ?? ""}
              onChange={(e) => setData("company", e.target.value)}
              disabled
            />
            {errors.company && (
              <p className="text-red-600">{errors.company}</p>
            )}
          </div>

          <Button type="submit" disabled={processing}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
