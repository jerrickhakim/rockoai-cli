/* @ai: TenantList component for displaying and accessing tenant workspaces the user has access to via Firestore queries */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";

import {
  collection,
  query,
  where,
  onSnapshot,
  CollectionReference,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { useUser } from "@/stores/userStore";

interface Tenant {
  id: string;
  name: string;
}

interface TenantListProps {
  path: string;
}

const TenantList: React.FC<TenantListProps> = ({ path }) => {
  const user = useUser();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Query tenants that the user has access to
    const tenantsQuery = query(
      collection(db, path) as CollectionReference,
      where(`users.${user.uid}`, "==", true),
    );

    const unsubscribe = onSnapshot(tenantsQuery, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Tenant[];

      setTenants(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, path]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="border-border flex h-[300px] flex-col items-center justify-center space-y-4 rounded border px-3 py-9">
        <h2 className="text-lg font-bold tracking-tight">
          No workplaces found
        </h2>
        <Button
          as={Link}
          href="/auth/create/workplaces"
          color="primary"
          variant="flat"
        >
          Create Workplace
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <div
          key={tenant.id}
          className="border-border relative rounded-xl border p-4 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold tracking-tight">
                {tenant.name}
              </h3>
            </div>
            <Button
              color="primary"
              size="md"
              as={Link}
              href={`/dashboard/${path}/${tenant.id}`}
            >
              Visit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TenantList;
