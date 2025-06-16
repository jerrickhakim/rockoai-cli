"use client";

import { Bell, CheckCheck } from "lucide-react";

type Notification = {
  id: string;
  data: {
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    payload: {
      title: string;
    };
    read: boolean;
    type: string;
    userId: string;
  };
};

type NotificationsTableProps = {
  notifications: Notification[];
};

export default function NotificationsTable({
  notifications,
}: NotificationsTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Notifications
        </h2>
        <p className="text-foreground/80 mb-6">
          Here are the latest notifications from your system.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-card border-b border-border">
            <tr>
              <th className="p-4 font-semibold text-foreground/80">Status</th>
              <th className="p-4 font-semibold text-foreground/80">Title</th>
              <th className="p-4 font-semibold text-foreground/80">User ID</th>
              <th className="p-4 font-semibold text-foreground/80">Date</th>
              <th className="p-4 font-semibold text-foreground/80">Type</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                className="border-b border-border last:border-b-0 hover:bg-card/50 transition-colors"
              >
                <td className="p-4">
                  {notification.data.read ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      <CheckCheck className="w-4 h-4 mr-1.5" /> Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                      <Bell className="w-4 h-4 mr-1.5" /> Unread
                    </span>
                  )}
                </td>
                <td className="p-4 text-foreground">
                  {notification.data.payload.title}
                </td>
                <td className="p-4 text-foreground/80 font-mono text-sm">
                  {notification.data.userId}
                </td>
                <td className="p-4 text-foreground/80">
                  {new Date(
                    notification.data.createdAt._seconds * 1000,
                  ).toLocaleDateString()}
                </td>
                <td className="p-4 text-foreground/80 capitalize">
                  {notification.data.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-border">
        <p className="text-sm text-foreground/60">
          Showing {notifications.length} results.
        </p>
      </div>
    </div>
  );
}
