import React from "react";

// Server
import { getTenants } from "@/server/auth";
export const dynamic = "force-dynamic";

// Metadata

// Components
import Link from "next/link";
import TenantList from "./_components/TenantList";

// Next UI
import { Button } from "@heroui/button";

import DashboardHeader from "@/components/ui/DashboardHeader";

//
//
//
export default async function page() {
  const workplaces = await getTenants("workplaces");
  return (
    <div className="mx-auto max-w-7xl p-4">
      <DashboardHeader
        title="My Workspace"
        endContent={
          <Button
            as={Link}
            href="/auth/create/workplaces"
            color="primary"
            className="text-white"
          >
            Create Workspace
          </Button>
        }
      />

      <TenantList path="workplaces" />
    </div>
  );
}
