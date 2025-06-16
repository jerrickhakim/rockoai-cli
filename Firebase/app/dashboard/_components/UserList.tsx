/* @ai: UserList component for fetching and displaying users within a tenant workspace */

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, Spinner } from "@heroui/react";

// Types
interface User {
  uid: string;
  displayName: string;
  role: string;
  avatar?: string;
}

const TeamMemberList: React.FC = () => {
  const { tenantId, tenantPath } = useParams<{
    tenantId: string;
    tenantPath: string;
  }>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const request = await fetch(`/api/${tenantPath}/${tenantId}/users`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (request.ok) {
          const res: User[] = await request.json();
          setUsers(res);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tenantId, tenantPath]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {/* <pre>{JSON.stringify(tenant, null, 2)}</pre> */}

      {users.map((user) => (
        <Link
          href={`/dashboard/${tenantPath}/${tenantId}/users/${user.uid}`}
          key={user.uid}
          className="bg-lightBody dark:bg-darkBody flex items-center space-x-3 rounded-lg p-4 shadow-md"
        >
          <Avatar size="lg" src={user.avatar} name={user.displayName} />

          <div>
            <h4 className="text-lg font-semibold">{user.displayName}</h4>
            <p className="text-gray-300">Role: {user.role}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TeamMemberList;
