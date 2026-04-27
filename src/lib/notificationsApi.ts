export type NotificationType =
  | "orders"
  | "messages"
  | "payments"
  | "reviews"
  | "matches"
  | "system";

export type NotificationAction = {
  label: string;
  type: "primary" | "secondary" | "danger";
};

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  group: "TODAY" | "YESTERDAY" | "THIS WEEK" | "OLDER";
  unread: boolean;
  avatar?: string;
  actions?: NotificationAction[];
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "orders",
    title: "New Order: Brand Identity Package",
    description:
      "TechFlow Inc. has accepted your proposal and funded the milestone. You can now begin work.",
    time: "2m ago",
    group: "TODAY",
    unread: true,
    actions: [{ label: "View Order", type: "primary" }],
  },
  {
    id: 2,
    type: "messages",
    title: "Message from Sarah Jenkins",
    description:
      '"Hi there, I reviewed the latest drafts and I\'m really happy with the direction. Could we adjust..."',
    time: "1h ago",
    group: "TODAY",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120",
    actions: [{ label: "Reply", type: "secondary" }],
  },
  {
    id: 3,
    type: "matches",
    title: "High Match: Senior UX Designer",
    description:
      "Our AI concierge found a 94% match for your skills with a new enterprise client looking for immediate help.",
    time: "4h ago",
    group: "TODAY",
    unread: true,
  },
  {
    id: 4,
    type: "payments",
    title: "Payment Processed: $1,250.00",
    description:
      "The funds for milestone 2 of 'E-commerce Redesign' have been successfully transferred to your account.",
    time: "Yesterday, 2:30 PM",
    group: "YESTERDAY",
    unread: false,
  },
  {
    id: 5,
    type: "reviews",
    title: "New 5-Star Review",
    description:
      '"Fantastic work, delivered ahead of schedule and exactly to specifications. Highly recommended!"',
    time: "Yesterday, 10:15 AM",
    group: "YESTERDAY",
    unread: false,
  },
  {
    id: 6,
    type: "system",
    title: "New Login Detected",
    description:
      "We noticed a login from a new device (Mac OS, Chrome) in London, UK. If this was you, no action is needed.",
    time: "Tue, 9:00 AM",
    group: "THIS WEEK",
    unread: false,
    actions: [
      { label: "Yes, it was me", type: "secondary" },
      { label: "Secure Account", type: "danger" },
    ],
  },
];

export async function getNotifications() {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`);
  // if (!res.ok) throw new Error("Failed to fetch notifications");
  // return res.json();

  return new Promise<NotificationItem[]>((resolve) => {
    setTimeout(() => resolve(mockNotifications), 300);
  });
}

export async function markAllNotificationsAsRead() {
  // REAL API:
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
  //   method: "PATCH",
  // });

  return { success: true };
}

export async function markNotificationAsRead(id: number) {
  // REAL API:
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
  //   method: "PATCH",
  // });

  return { success: true };
}

export async function loadOlderNotifications() {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?cursor=older`);
  // return res.json();

  return new Promise<NotificationItem[]>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: 7,
            type: "messages",
            title: "Message from Support Team",
            description:
              "Your account setup is almost complete. Please finish your verification step.",
            time: "Last week",
            group: "OLDER",
            unread: false,
            actions: [{ label: "Open", type: "secondary" }],
          },
        ]),
      300
    );
  });
}