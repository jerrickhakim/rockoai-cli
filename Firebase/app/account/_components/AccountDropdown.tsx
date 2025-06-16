/* @ai: AccountDropdown component for user profile navigation. Displays user avatar and dropdown menu with links to account pages and logout functionality */
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

import { logout } from "@/firebase/client";

import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface User {
  photoURL?: string;
  displayName?: string;
  email?: string;
}

const AccountDropdown: React.FC = () => {
  const user = useUser() as User;
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src={user?.photoURL}
            name={user?.displayName}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>

          <DropdownItem as={Link} href="/account" key="projects">
            Projects
          </DropdownItem>

          <DropdownItem as={Link} href="/account/details" key="account">
            My Account
          </DropdownItem>

          <DropdownItem
            key="logout"
            color="danger"
            onPress={async () => {
              await logout();
              router.push("/auth/login");
            }}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AccountDropdown;
