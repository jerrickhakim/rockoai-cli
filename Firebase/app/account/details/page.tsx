import React from "react";

import AccountDetailsView from "../_components/AccountDetailsView";
import { getCurrentUserDetails } from "@/server/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Account",
  description: "Edit your account details",
};

export default async function page() {
  const userDetails = await getCurrentUserDetails();
  return <AccountDetailsView />;
}
