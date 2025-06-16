/* @ai: RemoveUserButton component for removing users from a tenant workspace with confirmation dialog */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

const RemoveUserButton: React.FC = () => {
  const { tenantId, tenantPath, userId } = useParams<{
    tenantId: string;
    tenantPath: string;
    userId: string;
  }>();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const confirmDeleted = async (): Promise<void> => {
    try {
      const request = await fetch(
        `/api/workplaces/${tenantPath}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (request.ok) {
        router.push(`/dashboard/${tenantPath}/${tenantId}/users`);
      } else {
        console.error("Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const onPress = (): void => {
    setConfirmOpen(true);
  };

  return (
    <div>
      <Button color="danger" onPress={onPress}>
        Remove User
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmDeleted}
        title="Remove User"
        message="Are you sure you want to remove this user?"
      />
    </div>
  );
};

export default RemoveUserButton;
