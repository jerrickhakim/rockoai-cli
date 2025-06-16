/* @ai: TeamMemberList component for displaying all members of a tenant workspace with their roles */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { addToast } from "@heroui/toast";

interface User {
  uid: string;
  displayName: string;
  role: string;
}

const TeamMemberList: React.FC = () => {
  const { tenantId, tenantPath } = useParams<{
    tenantId: string;
    tenantPath: string;
  }>();

  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMembers = async (): Promise<void> => {
      try {
        const request = await fetch(`/api/workplaces/${tenantId}/users`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (request.ok) {
          const res: User[] = await request.json();
          setMembers(res);
        } else {
          addToast({
            title: "Error",
            description: "Failed to load team members",
            color: "danger",
          });
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        addToast({
          title: "Error",
          description: "An error occurred while loading team members",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [tenantId]);

  if (loading) {
    return <div className="py-10 text-center">Loading team members...</div>;
  }

  if (members.length === 0) {
    return <div className="py-10 text-center">No team members found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {members.map((user) => (
        <Link
          href={`/dashboard/${tenantPath}/${tenantId}/users/${user.uid}`}
          key={user.uid}
          className="rounded-lg bg-[#242424] p-4 shadow-md"
        >
          <h4 className="mb-2 text-lg font-semibold">{user.displayName}</h4>
          <p className="text-gray-300">Role: {user.role}</p>
        </Link>
      ))}
    </div>
  );
};

export default TeamMemberList;
