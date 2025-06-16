/* @ai: EditRoleButton component for changing a user's role (admin/team member) within a tenant workspace */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface User {
  role: string;
}

interface EditRoleButtonProps {
  user: User;
}

const EditRoleButton: React.FC<EditRoleButtonProps> = ({ user }) => {
  const { tenantId, tenantPath, userId } = useParams<{
    tenantId: string;
    tenantPath: string;
    userId: string;
  }>();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const confirmChange = async (): Promise<void> => {
    try {
      const request = await fetch(
        `/api/workplaces/${tenantId}/users/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: user.role === "admin" ? "teamMember" : "admin",
          }),
        },
      );

      if (request.ok) {
        router.push(`/dashboard/${tenantPath}/${tenantId}/users`);
      } else {
        console.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const onPress = (): void => {
    setConfirmOpen(true);
  };

  const roleLabel =
    user.role === "admin" ? "Downgrade to team member" : "Promote to admin";

  return (
    <div>
      <Button onPress={onPress}>{roleLabel}</Button>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={confirmChange}
        title="Confirmation required"
        message="Are you sure you want to change the role of this user?"
        deleteText="Change role"
      />
    </div>
  );
};

export default EditRoleButton;
