/* @ai: Resubscribe component that handles subscription renewal and redirects based on subscription status */
"use client";

import React, { ReactNode } from "react";
import { useParams } from "next/navigation";

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface Plan {
  id: string;
  name: string;
  prices: any[];
}

interface ResubscribeProps {
  children: ReactNode;
  user: User | null;
  plans: Plan[];
}

const Resubscribe: React.FC<ResubscribeProps> = ({ children, user, plans }) => {
  const { tenantId, tenantPath } = useParams<{
    tenantId: string;
    tenantPath: string;
  }>();

  // This component is for subscription flow management
  // The commented code below is available for when you need to implement
  // subscription status checking and redirection logic

  /*
  useEffect(() => {
    if (
      pathname.includes("resubscribe") &&
      allowed.includes(tenant.subscriptionStatus)
    ) {
      router.push(`/dashboard/${tenantPath}/${tenantId}`);
    } else if (
      !(tenant.subscriptionId && allowed.includes(tenant.subscriptionStatus))
    ) {
      router.push(
        `/dashboard/${tenantPath}/${tenantId}/resubscribe`
      );
    }
  }, [tenant, router, tenantId, tenantPath, pathname]);
  */

  return children;
};

export default Resubscribe;
