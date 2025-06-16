// Third-party libraries
import React from "react";
import Icon from "@mdi/react";
import { mdiHome, mdiAccountEdit } from "@mdi/js";

// Server hooks
import { getCurrentUser } from "@/server/auth";

// Local components
import ApplicationLayout from "@/components/layouts/ApplicationLayout";
import { User } from "firebase/auth";

//
// AccountLayout
//
const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  // Server hooks
  const user = await getCurrentUser();

  const links = [
    {
      href: `/account`,
      text: "Home",
      icon: <Icon path={mdiHome} size={1} />,
      visible: true,
    },
    {
      href: `/account/details`,
      text: "Account",
      icon: <Icon path={mdiAccountEdit} size={1} />,
      visible: true,
    },
  ];

  return (
    <ApplicationLayout
      links={links}
      // @ts-expect-error Server user maps to client user object
      user={user as User}
      floating={false}
    >
      {children}
    </ApplicationLayout>
  );
};

export default AccountLayout;
