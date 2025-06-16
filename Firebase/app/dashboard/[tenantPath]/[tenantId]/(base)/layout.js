// Layouts
import ApplicationLayout from "@/components/layouts/ApplicationLayout";
import TenantProvider from "@/providers/TenantProvider";

import { getCurrentUser, getTenants } from "@/server/auth";

import Icon from "@mdi/react";
import { mdiHome, mdiAccountGroup, mdiCreditCard } from "@mdi/js";

import { notFound } from "next/navigation";

import { redirect } from "next/navigation";

//
// Layout
//

export default async function Layout(props) {
  const params = await props.params;

  const { children } = props;

  const { tenantPath, tenantId } = params;

  const [user, tenants] = await Promise.all([
    getCurrentUser(),
    getTenants("workplaces"),
  ]);

  const tenantsIds = tenants.map((tenant) => tenant.id);

  const tenant = tenants.find((tenant) => tenant.id === tenantId);

  const allowed = ["active", "trialing"];

  if (
    tenant?.subscriptionStatus &&
    !allowed.includes(tenant.subscriptionStatus)
  ) {
    redirect(`/dashboard/${tenantPath}/${tenantId}/resubscribe`);
  }

  const links = [
    {
      href: `/dashboard/${tenantPath}/${tenantId}`,
      text: "Home",
      icon: <Icon path={mdiHome} size={1} />,
      visible: true,
    },

    {
      href: `/dashboard/${tenantPath}/${tenantId}/users`,
      text: "Users",
      icon: <Icon path={mdiAccountGroup} size={1} />,
      visible: true,
    },
    {
      href: `/dashboard/${tenantPath}/${tenantId}/billing`,
      text: "Billing",
      icon: <Icon path={mdiCreditCard} size={1} />,
      visible: true,
    },
  ];

  if (!tenantsIds.includes(tenantId)) {
    return notFound();
  }

  return (
    <>
      <TenantProvider path={tenantPath} id={tenantId} tenant={tenant}>
        <ApplicationLayout links={links} user={user} floating={false}>
          {children}
        </ApplicationLayout>
      </TenantProvider>
    </>
  );
}
