/* @ai: AccountDetailsView component that displays user profile information and management forms organized in tabs */
"use client";

// Components
import AccountDetailsForm from "./AccountDetailsForm";
import DisplayNameForm from "./DisplayNameForm";
import UpdateEmailForm from "./UpdateEmailForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import Avatar from "./Avatar";

// Next UI
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

// Hooks
import { useUser } from "@/stores/userStore";

//
// EditAccoutHome
//

function getGreeting() {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good morning";
  } else if (hours < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default function EditAccoutHome() {
  const user = useUser();

  const prettyTimeStamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    const dateString = date.toLocaleDateString("en-US", options);

    return dateString;
  };

  if (!user) return null;
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-3 items-center space-y-2 p-2 md:flex md:space-x-4">
        <Avatar />

        <div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.displayName}
          </h1>

          <small>
            Member since:{" "}
            {prettyTimeStamp(
              user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).getTime()
                : Date.now(),
            )}
          </small>
        </div>
      </div>

      <Tabs aria-label="Details">
        <Tab key="details" title="Details">
          <Card className="mb-3">
            <CardBody>
              <AccountDetailsForm />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <DisplayNameForm />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="security" title="Security">
          <Card className="mb-3">
            <CardBody>
              <UpdateEmailForm />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <UpdatePasswordForm />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
