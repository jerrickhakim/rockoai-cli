import React from "react";

import Link from "next/link";
import Image from "next/image";

import app from "@/app.json";

import { redirect } from "next/navigation";
// Next UI
import { Button } from "@heroui/button";
import TenantProvider from "@/providers/TenantProvider";
import Resubscribe from "@/app/dashboard/_components/Resubscribe";

import { getCurrentUser, getTenants } from "@/server/auth";

export default async function Layout(props) {
  const params = await props.params;

  const { children } = props;

  const { tenantId, tenantPath } = params;

  const [user, tenants] = await Promise.all([
    getCurrentUser(),
    getTenants(tenantPath),
  ]);

  const tenantsIds = tenants.map((tenant) => tenant.id);

  const tenant = tenants.find((tenant) => tenantId === tenantId);

  const allowed = ["active", "trialing"];

  if (allowed.includes(tenant?.subscriptionStatus)) {
    return redirect(`/dashboard/${tenantPath}/${tenantId}`);
  }

  if (!tenantsIds.includes(tenantId)) {
    return notFound();
  }

  return (
    <TenantProvider path={tenantPath} id={tenantId} tenant={tenant}>
      <Resubscribe>
        <main className="flex min-h-screen flex-col justify-center overflow-y-auto p-2">
          <Button
            radius="full"
            size="sm"
            as={Link}
            href="/"
            className="fixed top-4 left-4 z-10"
          >
            Back to site
          </Button>

          <div className="mx-auto my-8 w-full max-w-[400px]">{children}</div>
        </main>
      </Resubscribe>
    </TenantProvider>
  );
}
