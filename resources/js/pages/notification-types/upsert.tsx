import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRoute } from "ziggy-js";
import { routes } from "@/constants/routes";

interface NotificationType {
  type_id?: number;
  type_name: string;
  company_id: number;
}

export default function Upsert({ notification_type }: { notification_type?: NotificationType }) {
  const isEdit = !!notification_type;
  const route = useRoute();

  const { data, setData, post, put, processing, errors } = useForm({
    type_name: notification_type?.type_name ?? "",
    company_id: notification_type?.company_id ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      put(route(routes.notificationsTypes.update, notification_type?.type_id));
    } else {
      post(route(routes.notificationsTypes.store));
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Notification Types", href: route(routes.notificationsTypes.index) },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Notification Type`} />

      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Notification Type" : "Create Notification Type"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="type_name">Type Name</Label>
            <Input
              id="type_name"
              value={data.type_name}
              onChange={(e) => setData("type_name", e.target.value)}
            />
            {errors.type_name && <p className="text-red-600">{errors.type_name}</p>}
          </div>

          {/* <div>
            <Label htmlFor="company_id">Company ID</Label>
            <Input
              id="company_id"
              value={data.company_id}
              onChange={(e) => setData("company_id", e.target.value)}
            />
            {errors.company_id && <p className="text-red-600">{errors.company_id}</p>}
          </div>

          <div>
            <Label htmlFor="entry_user_id">Entry User ID</Label>
            <Input
              id="entry_user_id"
              value={data.entry_user_id}
              onChange={(e) => setData("entry_user_id", e.target.value)}
            />
            {errors.entry_user_id && <p className="text-red-600">{errors.entry_user_id}</p>}
          </div> */}

          <Button type="submit" disabled={processing}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
