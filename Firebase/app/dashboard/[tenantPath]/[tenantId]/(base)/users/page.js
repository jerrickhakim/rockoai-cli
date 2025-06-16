import React from "react";

export const metadata = {
  title: "Users",
};

// Next
import Link from "next/link";

// Next UI
import { Button } from "@heroui/button";

// Components
import UserList from "@/app/dashboard/_components/UserList";

//
//
//

export default async function page(props) {
  const params = await props.params;
  const { tenantPath, tenantId } = params;

  return (
    <>
      <div className="p-4">
        <div className="borderBottom mb-2 flex items-center justify-between pb-2">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>

          <Button
            as={Link}
            href={`/dashboard/${tenantPath}/${tenantId}/users/add`}
            color="primary"
            className="text-white"
          >
            Add User
          </Button>
        </div>

        <UserList tenantPath={tenantPath} tenantId={tenantId} />
      </div>
    </>
  );
}
