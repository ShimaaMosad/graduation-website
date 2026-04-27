"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  HelpCircle,
  UserCircle,
  Briefcase,
  MessageSquare,
  CreditCard,
  Star,
  Sparkles,
  Settings,
  ShieldAlert,
  ShoppingBag,
  RefreshCcw,
} from "lucide-react";
import {
  getNotifications,
  loadOlderNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationItem,
  NotificationType,
} from"@/src/lib/notificationsApi";


const filters: {
  label: string;
  value: "all" | NotificationType;
  icon: any;
}[] = [
  { label: "All", value: "all", icon: MessageSquare },
  { label: "Orders", value: "orders", icon: Briefcase },
  { label: "Messages", value: "messages", icon: MessageSquare },
  { label: "Payments", value: "payments", icon: CreditCard },
  { label: "Reviews", value: "reviews", icon: Star },
  { label: "Job Matches", value: "matches", icon: Sparkles },
  { label: "System", value: "system", icon: Settings },
];

const groups = ["TODAY", "YESTERDAY", "THIS WEEK", "OLDER"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | NotificationType>(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [olderLoading, setOlderLoading] = useState(false);

  useEffect(() => {
    getNotifications().then((res) => {
      setNotifications(res);
      setLoading(false);
    });
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((item) => item.type === activeFilter);
  }, [notifications, activeFilter]);

  function getFilterCount(value: "all" | NotificationType) {
    if (value === "all") return notifications.length;
    return notifications.filter((item) => item.type === value).length;
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  }

  async function handleCardClick(id: number) {
    await markNotificationAsRead(id);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );
  }

  async function handleLoadOlder() {
    setOlderLoading(true);
    const older = await loadOlderNotifications();

    setNotifications((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueOlder = older.filter((item) => !existingIds.has(item.id));
      return [...prev, ...uniqueOlder];
    });

    setOlderLoading(false);
  }

  function handleAction(label: string, item: NotificationItem) {
    if (label === "View Order") {
      alert(`Opening order notification: ${item.title}`);
    }

    if (label === "Reply") {
      alert(`Opening reply box for: ${item.title}`);
    }

    if (label === "Secure Account") {
      alert("Redirecting to security settings...");
    }

    if (label === "Yes, it was me") {
      alert("Login confirmed as safe.");
    }

    if (label === "Open") {
      alert(`Opening: ${item.title}`);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7ff]">
        <p className="text-gray-500">Loading notifications...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ff] text-[#211827]">
      <header className="flex h-[64px] items-center justify-between border-b border-purple-100 bg-white px-6">
        <h1 className="text-[24px] font-bold">MySite</h1>

        <nav className="flex items-center gap-10 text-[14px]">
          <button>Explore</button>
          <button>Jobs</button>
          <button>Messages</button>
          <button>Support</button>
        </nav>

        <div className="flex items-center gap-5">
          <button>Login</button>
          <button className="rounded-md border border-purple-300 px-5 py-2 text-purple-700">
            Post a Job
          </button>

          <div className="relative">
            <Bell size={22} className="text-purple-700" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>

          <HelpCircle size={21} className="text-gray-600" />
          <UserCircle size={29} className="text-slate-700" />
        </div>
      </header>

      <section className="grid grid-cols-[300px_1fr] gap-9 px-6 py-9">
        <aside>
          <h2 className="mb-5 text-[18px] font-bold">Filters</h2>

          <div className="space-y-1">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const active = activeFilter === filter.value;
              const count = getFilterCount(filter.value);

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                    active
                      ? "bg-purple-700 text-white"
                      : "text-[#4b4553] hover:bg-purple-50"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <Icon size={18} />
                    {filter.label}
                  </span>

                  {count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-purple-600 text-white"
                          : "bg-transparent text-[#4b4553]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <section>
          <div className="mb-7 flex items-center justify-between border-b border-purple-100 pb-5">
            <h1 className="text-[34px] font-bold">Notifications</h1>

            <button
              onClick={handleMarkAllRead}
              className="text-[14px] font-medium text-purple-700"
            >
              Mark all as read
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-purple-200 bg-white p-12 text-center">
              <h3 className="text-xl font-bold">No notifications found</h3>
              <p className="mt-2 text-gray-600">
                Try changing the selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => {
                const groupItems = filteredNotifications.filter(
                  (item) => item.group === group
                );

                if (groupItems.length === 0) return null;

                return (
                  <div key={group}>
                    <h3 className="mb-4 text-xs font-semibold tracking-widest text-gray-600">
                      {group}
                    </h3>

                    <div className="space-y-4">
                      {groupItems.map((item) => (
                        <NotificationCard
                          key={item.id}
                          item={item}
                          onRead={handleCardClick}
                          onAction={handleAction}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 border-t border-purple-100 pt-7 text-center">
            <button
              onClick={handleLoadOlder}
              disabled={olderLoading}
              className="inline-flex items-center gap-3 border border-gray-500 bg-white px-7 py-4 text-[15px] disabled:opacity-60"
            >
              <RefreshCcw size={17} />
              {olderLoading ? "Loading..." : "Load Older Notifications"}
            </button>
          </div>
        </section>
      </section>

      <footer className="mt-10 flex h-[90px] items-center justify-between border-t bg-white px-6">
        <div className="flex items-center gap-8">
          <h2 className="text-[18px] font-bold">MySite</h2>
          <p className="text-sm text-gray-600">
            © 2024 MySite AI. Empowering the global workforce.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-gray-600">
          <button>Terms</button>
          <button>Privacy</button>
          <button>Cookies</button>
          <button>Security</button>
          <button>Contact</button>
        </div>
      </footer>
    </main>
  );
}

function NotificationCard({
  item,
  onRead,
  onAction,
}: {
  item: NotificationItem;
  onRead: (id: number) => void;
  onAction: (label: string, item: NotificationItem) => void;
}) {
  const { icon, bg, color } = getNotificationIcon(item.type);

  return (
    <div
      onClick={() => onRead(item.id)}
      className="relative cursor-pointer rounded-lg border border-purple-200 bg-white px-6 py-5 shadow-sm transition hover:shadow-md"
    >
      {item.unread && (
        <span className="absolute left-3 top-7 h-2 w-2 rounded-full bg-purple-700" />
      )}

      <div className="flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${bg} ${color}`}
        >
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            icon
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between gap-5">
            <h3 className="text-[18px] font-bold">{item.title}</h3>
            <span className="whitespace-nowrap text-xs text-gray-500">
              {item.time}
            </span>
          </div>

          <p className="mt-2 text-[14px] leading-6 text-gray-600">
            {item.description}
          </p>

          {item.actions && item.actions.length > 0 && (
            <div className="mt-4 flex gap-5">
              {item.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(action.label, item);
                  }}
                  className={`px-5 py-3 text-sm ${
                    action.type === "primary"
                      ? "bg-purple-700 text-white"
                      : action.type === "danger"
                      ? "text-red-600"
                      : "border border-gray-500 bg-white text-gray-800"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getNotificationIcon(type: NotificationType) {
  if (type === "orders") {
    return {
      icon: <ShoppingBag size={21} />,
      bg: "bg-blue-600",
      color: "text-white",
    };
  }

  if (type === "messages") {
    return {
      icon: <MessageSquare size={21} />,
      bg: "bg-blue-100",
      color: "text-blue-700",
    };
  }

  if (type === "payments") {
    return {
      icon: <CreditCard size={21} />,
      bg: "bg-purple-100",
      color: "text-purple-700",
    };
  }

  if (type === "reviews") {
    return {
      icon: <Star size={21} />,
      bg: "bg-orange-100",
      color: "text-orange-700",
    };
  }

  if (type === "matches") {
    return {
      icon: <Sparkles size={21} />,
      bg: "bg-purple-300",
      color: "text-purple-800",
    };
  }

  return {
    icon: <ShieldAlert size={21} />,
    bg: "bg-red-100",
    color: "text-red-600",
  };
}