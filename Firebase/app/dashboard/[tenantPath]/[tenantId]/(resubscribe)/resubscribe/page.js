// import React, { useState, useEffect } from "react";

import CreateTenantForm from "@/components/purchase/CreateTenantForm";

import { getCurrentUser } from "@/server/auth";
import { getPlans } from "@/server/stripe";
import { redirect } from "next/navigation";
import { getTenant } from "@/server/tenant";

// export const metadata = {
//   title: "Create Workspace",
//   description: "Create a new workspace",
// };

import { useUser } from "@/providers/UserProvider";
import { useTenant } from "@/providers/TenantProvider";
export default async function Page(props) {
  const params = await props.params;
  const { tenantPath, tenantId } = params;
  const [user, plans, tenant] = await Promise.all([
    getCurrentUser(),
    getPlans(),
    getTenant(tenantPath, tenantId),
  ]);

  const allowed = ["active", "trialing"];

  if (allowed.includes(tenant.subscriptionStatus)) {
    redirect(`/dashboard/${tenantPath}/${tenantId}`);
  }

  return (
    <>
      {/* <pre> {JSON.stringify(user, null, 2)}</pre> */}

      <CreateTenantForm
        title="Your subscription is expired"
        description="Please renew your subscription to continue using the app"
        user={user}
        plans={plans}
        path={tenantPath}
      />
    </>
  );
}
