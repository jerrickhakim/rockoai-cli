"use client";

import React from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { useParams } from "next/navigation";

export default function BillingCard({ scope }) {
  const params = useParams();

  //
  // func getPortalLink
  //
  async function getPortalLink() {
    const token = await getToken();
    const request = await fetch(`/api/stripe/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "workplaces",
        tenantId: params.tenantId,
      }),
    });
    const data = await request.json();
    console.log(data);

    if (request.ok) {
      window.location.href = data.url;
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>Billing</CardHeader>
        <CardBody>
          <p className="mb-3 text-sm">
            To manage your billing please proceed to the billing portal.
          </p>
        </CardBody>

        <CardFooter>
          <Button onPress={getPortalLink}>Billing Portal</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
