"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Icon from "@mdi/react";
import { mdiAccountGroup, mdiCreditCard } from "@mdi/js";

export default function Page(props) {
  const params = use(props.params);
  const { tenantPath, tenantId } = params;
  const router = useRouter();

  const features = [
    {
      id: 1,
      title: "User Management",
      icon: mdiAccountGroup,
      href: `/dashboard/${tenantPath}/${tenantId}/users`,
    },
    {
      id: 2,
      title: "Billing",
      icon: mdiCreditCard,
      href: `/dashboard/${tenantPath}/${tenantId}/billing`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">
          Welcome to Your SaaS Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Start building your feature here!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="bg-card dark:bg-darkHeader shadow-md"
          >
            <CardBody>
              <Link
                href={feature.href}
                className="flex flex-col items-center p-4"
              >
                <Icon
                  path={feature.icon}
                  size={2}
                  className="text-primary mb-2"
                />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
