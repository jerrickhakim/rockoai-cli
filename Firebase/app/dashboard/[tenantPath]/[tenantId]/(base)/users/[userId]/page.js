import React from "react";

export const metadata = {
  title: "User",
};

import Link from "next/link";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";

import { getCurrentUserForTenant } from "@/server/tenant";

import RemoveUserButton from "@/app/dashboard/_components/RemoveUserButton";
import EditRoleButton from "@/app/dashboard/_components/EditRoleButton";

import { getCurrentUser } from "@/server/auth";

export default async function page(props) {
  const params = await props.params;
  const { tenantPath, tenantId, userId } = params;

  const user = await getCurrentUserForTenant(tenantPath, tenantId, userId);

  const currentUser = await getCurrentUser();

  return (
    <div className="mx-auto max-w-xl p-4">
      <div className="mb-2 flex items-center justify-between border-b border-zinc-900 py-3 pb-2">
        <div className="flex space-x-2">
          <Avatar
            src={user.avatar}
            size="large"
            alt={user.displayName}
            name={user.displayName}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold tracking-tight">
            {user.displayName}
          </h1>
        </div>

        <Button
          as={Link}
          href={`/dashboard/${tenantPath}/${tenantId}/users`}
          color="primary"
          className="text-white"
        >
          Back
        </Button>
      </div>

      {currentUser.uid === userId ? (
        <div
          className="relative mb-3 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">
            You cannot remove yourself or change your role. Please contact an
            admin of the workplace.
          </span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <RemoveUserButton user={user} />
          <EditRoleButton user={user} />
        </div>
      )}
    </div>
  );
}
