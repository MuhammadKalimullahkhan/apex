import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRoute } from "ziggy-js";
import { routes } from "@/constants/routes";

interface Company {
  company_id?: number;
  company_name: string;
  registration_number?: string;
  location?: string;
  business_email: string;
  website?: string;
}

export default function Upsert({ company }: { company?: Company }) {
  const isEdit = !!company;
  const route = useRoute();

  const { data, setData, post, put, processing, errors } = useForm({
    company_name: company?.company_name ?? "",
    registration_number: company?.registration_number ?? "",
    location: company?.location ?? "",
    business_email: company?.business_email ?? "",
    website: company?.website ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      put(route(routes.companies.update, company?.company_id));
    } else {
      post(route(routes.companies.store));
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Companies", href: route(routes.companies.index) },
        { title: isEdit ? "Edit" : "Create", href: "#" },
      ]}
    >
      <Head title={`${isEdit ? "Edit" : "Create"} Company`} />

      <div className="page-wrapper">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Company" : "Create Company"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={data.company_name}
              onChange={(e) => setData("company_name", e.target.value)}
            />
            {errors.company_name && (
              <p className="text-red-600">{errors.company_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input
              id="registration_number"
              value={data.registration_number}
              onChange={(e) => setData("registration_number", e.target.value)}
            />
            {errors.registration_number && (
              <p className="text-red-600">{errors.registration_number}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => setData("location", e.target.value)}
            />
            {errors.location && (
              <p className="text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <Label htmlFor="business_email">Business Email</Label>
            <Input
              id="business_email"
              type="email"
              value={data.business_email}
              onChange={(e) => setData("business_email", e.target.value)}
            />
            {errors.business_email && (
              <p className="text-red-600">{errors.business_email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => setData("website", e.target.value)}
            />
            {errors.website && (
              <p className="text-red-600">{errors.website}</p>
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
