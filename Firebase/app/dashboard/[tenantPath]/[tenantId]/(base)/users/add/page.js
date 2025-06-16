import React from "react";

import Link from "next/link";

import { Button } from "@heroui/button";

import AddTeamMemberForm from "@/app/dashboard/_components/AddTeamMemberForm";

export default async function page(props) {
  const params = await props.params;
  const { tenantId } = params;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between borderBottom pb-2 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Add User</h1>

        <Button as={Link} href={`/dashboard/${tenantId}/users`} color="primary" className="text-white">
          View
        </Button>
      </div>

      <AddTeamMemberForm tenantId={tenantId} />
    </div>
  );
}
