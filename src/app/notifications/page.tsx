"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag, MessageSquare, CreditCard, Star,
  Sparkles, ShieldAlert, RefreshCcw, Search, LayoutList, Bell,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type NotificationType = "orders" | "messages" | "payments" | "reviews" | "matches" | "system";
type NotificationGroup = "TODAY" | "YESTERDAY" | "THIS WEEK" | "OLDER";

interface NotificationAction {
  label: string;
  type: "primary" | "secondary" | "danger";
}

interface NotificationItem {
  id: number;
  type: NotificationType;
  group: NotificationGroup;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  avatar?: string;
  actions?: NotificationAction[];
}

// ── API response shape from your backend ──────────────────────────────────────
// Your API should return an array of NotificationItem objects.
// Each item must include: id, type, group, title, description, time, unread
// Optional: avatar, actions[]
//
// Example response from GET /api/notifications:
// [
//   {
//     "id": 1,
//     "type": "orders",
//     "group": "TODAY",
//     "title": "New order received",
//     "description": "Order #1042 from Sarah M. — $48.00 for 2 items.",
//     "time": "2m ago",
//     "unread": true,
//     "actions": [{ "label": "View Order", "type": "primary" }]
//   },
//   ...
// ]

// ── API functions (swap comments to switch between real API and mock) ──────────

async function fetchNotifications(): Promise<NotificationItem[]> {
  // ── REAL API (uncomment when backend is ready) ──
  // const res = await fetch("/api/notifications");
  // if (!res.ok) throw new Error("Failed to fetch notifications");
  // return res.json();

  // ── MOCK DATA (remove when using real API) ──
  return new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: 1, type: "orders",   group: "TODAY",     title: "New order received",  description: "Order #1042 from Sarah M. — $48.00 for 2 items.",                                           time: "2m ago",    unread: true,  actions: [{ label: "View Order", type: "primary" }] },
          { id: 2, type: "messages", group: "TODAY",     title: "Message from Alex",   description: "Hey, is this item still available? I'd like to buy it ASAP.",                               time: "14m ago",   unread: true,  actions: [{ label: "Reply", type: "primary" }] },
          { id: 3, type: "payments", group: "TODAY",     title: "Payment received",    description: "$120.00 has been deposited into your account from order #1038.",                             time: "1h ago",    unread: false, actions: [] },
          { id: 4, type: "system",   group: "TODAY",     title: "New login detected",  description: "A login was detected from Cairo, EG. If this wasn't you, secure your account immediately.", time: "3h ago",    unread: true,  actions: [{ label: "Secure Account", type: "danger" }, { label: "Yes, it was me", type: "secondary" }] },
          { id: 5, type: "reviews",  group: "YESTERDAY", title: "New 5-star review",   description: '"Great product, fast shipping, highly recommend!" — from @hamza_k',                        time: "Yesterday", unread: false, actions: [{ label: "Open", type: "primary" }] },
          { id: 6, type: "matches",  group: "YESTERDAY", title: "New job match found", description: 'A new project matching your skills: "React Native developer needed for 3 months."',        time: "Yesterday", unread: true,  actions: [{ label: "Open", type: "primary" }] },
          { id: 7, type: "orders",   group: "THIS WEEK", title: "Order shipped",       description: "Order #1035 shipped via Aramex. Expected delivery: May 9.",                                 time: "Mon",       unread: false, actions: [] },
          { id: 8, type: "payments", group: "THIS WEEK", title: "Payout processed",    description: "Your weekly payout of $340.00 has been sent to your bank account.",                         time: "Sun",       unread: false, actions: [] },
        ]),
      400
    )
  );
}

async function fetchOlderNotifications(): Promise<NotificationItem[]> {
  // ── REAL API (uncomment when backend is ready) ──
  // const res = await fetch("/api/notifications?group=older");
  // if (!res.ok) throw new Error("Failed to load older notifications");
  // return res.json();

  // ── MOCK DATA (remove when using real API) ──
  return new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: 9,  type: "messages", group: "OLDER", title: "Support replied",  description: "Your support ticket #772 has been resolved.",              time: "Last week", unread: false, actions: [] },
          { id: 10, type: "orders",   group: "OLDER", title: "Order completed",  description: "Order #1020 was marked as completed by the buyer.",         time: "May 1",     unread: false, actions: [] },
        ]),
      800
    )
  );
}

async function patchMarkRead(id: number): Promise<void> {
  // ── REAL API (uncomment when backend is ready) ──
  // await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });

  // ── MOCK (remove when using real API) ──
  console.log("markRead", id);
}

async function patchMarkAllRead(): Promise<void> {
  // ── REAL API (uncomment when backend is ready) ──
  // await fetch("/api/notifications/read-all", { method: "PATCH" });

  // ── MOCK (remove when using real API) ──
  console.log("markAllRead");
}

// ── Config ─────────────────────────────────────────────────────────────────────
const FILTERS = [
  { label: "All",      value: "all"      as const, icon: LayoutList    },
  { label: "Orders",   value: "orders"   as const, icon: ShoppingBag   },
  { label: "Messages", value: "messages" as const, icon: MessageSquare },
  { label: "Payments", value: "payments" as const, icon: CreditCard    },
  { label: "Reviews",  value: "reviews"  as const, icon: Star          },
  { label: "Matches",  value: "matches"  as const, icon: Sparkles      },
  { label: "System",   value: "system"   as const, icon: ShieldAlert   },
];

const GROUPS: NotificationGroup[] = ["TODAY", "YESTERDAY", "THIS WEEK", "OLDER"];

const ICON_STYLE: Record<NotificationType, { icon: any; bg: string; color: string }> = {
  orders:   { icon: ShoppingBag,   bg: "bg-blue-100",   color: "text-blue-700"   },
  messages: { icon: MessageSquare, bg: "bg-sky-100",    color: "text-sky-700"    },
  payments: { icon: CreditCard,    bg: "bg-purple-100", color: "text-purple-700" },
  reviews:  { icon: Star,          bg: "bg-orange-100", color: "text-orange-600" },
  matches:  { icon: Sparkles,      bg: "bg-violet-200", color: "text-violet-800" },
  system:   { icon: ShieldAlert,   bg: "bg-red-100",    color: "text-red-600"    },
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | NotificationType>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [olderLoading, setOlderLoading] = useState(false);

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifications.filter((n) => {
      const typeOk = activeFilter === "all" || n.type === activeFilter;
      const textOk = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      return typeOk && textOk;
    });
  }, [notifications, activeFilter, search]);

  const getCount = (v: "all" | NotificationType) =>
    v === "all" ? notifications.length : notifications.filter((n) => n.type === v).length;

  async function handleMarkAllRead() {
    await patchMarkAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  async function handleCardClick(id: number) {
    await patchMarkRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  async function handleLoadOlder() {
    setOlderLoading(true);
    const older = await fetchOlderNotifications();
    setNotifications((prev) => {
      const ids = new Set(prev.map((n) => n.id));
      return [...prev, ...older.filter((n) => !ids.has(n.id))];
    });
    setOlderLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7ff]">
        <p className="text-gray-400">Loading notifications…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ff] px-4 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#211827]">Notifications</h1>
          <button onClick={handleMarkAllRead} className="text-sm font-medium text-purple-700">
            Mark all as read
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-purple-100 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-purple-400"
          />
        </div>

        {/* Filter pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map(({ label, value, icon: Icon }) => {
            const active = activeFilter === value;
            const count = getCount(value);
            return (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-purple-700 bg-purple-700 text-white"
                    : "border-purple-100 bg-white text-gray-600 hover:border-purple-300"
                }`}
              >
                <Icon size={14} />
                {label}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 text-xs ${active ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-purple-100 bg-white p-12 text-center">
            <Bell className="mx-auto mb-3 text-gray-300" size={30} />
            <p className="font-semibold text-gray-600">No notifications found</p>
            <p className="mt-1 text-sm text-gray-400">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {GROUPS.map((group) => {
              const items = filtered.filter((n) => n.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400">{group}</p>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <NotificationCard key={item.id} item={item} onRead={handleCardClick} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load older */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadOlder}
            disabled={olderLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm text-gray-500 disabled:opacity-50"
          >
            <RefreshCcw size={14} />
            {olderLoading ? "Loading…" : "Load older notifications"}
          </button>
        </div>
      </div>
    </main>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function NotificationCard({
  item,
  onRead,
}: {
  item: NotificationItem;
  onRead: (id: number) => void;
}) {
  const { icon: Icon, bg, color } = ICON_STYLE[item.type];

  function handleAction(e: React.MouseEvent, label: string) {
    e.stopPropagation();
    // Wire to your router / modal here — e.g. router.push(`/orders/${item.id}`)
    alert(`Action: ${label}`);
  }

  return (
    <div
      onClick={() => onRead(item.id)}
      className="relative cursor-pointer rounded-xl border border-purple-100 bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
    >
      {item.unread && (
        <span className="absolute left-2.5 top-6 h-2 w-2 rounded-full bg-purple-700" />
      )}
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg} ${color}`}>
          {item.avatar ? (
            <img src={item.avatar} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            <Icon size={17} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <p className="font-semibold leading-tight text-[#211827]">{item.title}</p>
            <span className="whitespace-nowrap text-xs text-gray-400">{item.time}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
          {item.actions && item.actions.length > 0 && (
            <div className="mt-3 flex gap-3">
              {item.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={(e) => handleAction(e, action.label)}
                  className={
                    action.type === "primary"
                      ? "rounded-md bg-purple-700 px-4 py-1.5 text-xs text-white"
                      : action.type === "danger"
                      ? "text-xs text-red-500"
                      : "rounded-md border border-gray-200 px-4 py-1.5 text-xs text-gray-600"
                  }
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