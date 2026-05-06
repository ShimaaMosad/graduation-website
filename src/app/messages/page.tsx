"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  User,
  Settings,
  HelpCircle,
  Bell,
  Mail,
  PenSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Conversation, getConversations, markAllMessagesRead } from "../../lib/messages-api";
 "@/src/lib/messages-api";


type FilterType = "All" | "Unread" | "Active Orders" | "Archived";

const filters: FilterType[] = ["All", "Unread", "Active Orders", "Archived"];

const StatusDot = ({ online }: { online?: boolean }) => {
  return (
    <span
      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
        online ? "bg-green-500" : "bg-gray-300"
      }`}
    />
  );
};

const Avatar = ({ conversation }: { conversation: Conversation }) => {
  if (conversation.avatar) {
    return (
      <div className="relative h-11 w-11 flex-shrink-0">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="h-11 w-11 rounded-full object-cover"
        />
        <StatusDot online={conversation.online} />
      </div>
    );
  }

  return (
    <div className="relative h-11 w-11 flex-shrink-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
        {conversation.initials}
      </div>
      <StatusDot online={conversation.online} />
    </div>
  );
};

export default function MessagesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [conversationsData, setConversationsData] = useState<Conversation[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4;

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversationsData(data);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const unreadCount = conversationsData.reduce(
    (sum, item) => sum + item.unread,
    0
  );

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "My Gigs", href: "/freelancer/mygigs" },
    { icon: ShoppingCart, label: "Orders", href: "/completedorder" },
    {
      icon: MessageSquare,
      label: "Messages",
      href: "/messages",
      badge: unreadCount,
    },
    { icon: DollarSign, label: "Earnings", href: "/earnings" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleMarkAllRead = async () => {
    const res = await markAllMessagesRead();

    if (res.success) {
      setConversationsData((prev) =>
        prev.map((item) => ({
          ...item,
          unread: 0,
        }))
      );

      setNotice(res.message);

      setTimeout(() => {
        setNotice("");
      }, 2500);
    }
  };

  const filteredConversations = conversationsData.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "Unread") return conv.unread > 0;
    if (activeFilter === "Active Orders") return conv.activeOrder;
    if (activeFilter === "Archived") return conv.archived;

    return true;
  });

  const sortedConversations = [...filteredConversations].sort(
    (a, b) => b.unread - a.unread
  );

  const totalPages = Math.ceil(sortedConversations.length / itemsPerPage);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedConversations = sortedConversations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
   

      <main className="flex-1 overflow-y-auto">
   

        <div className="px-8 py-6">
          {notice && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {unreadCount} unread
              </span>
            </div>

            <button
              onClick={() => router.push("/messages/conv-1")}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <PenSquare size={16} />
              Compose
            </button>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Total Conversations
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {conversationsData.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <MessageSquare size={22} className="text-gray-300" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
              <div>
                <p className="mb-1 text-sm text-gray-500">Unread Messages</p>
                <p className="text-3xl font-bold text-violet-600">
                  {unreadCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                <Mail size={22} className="text-violet-200" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Avg Response Time
                </p>
                <p className="text-3xl font-bold text-gray-900">2 hrs</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <Clock size={22} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div className="relative max-w-sm flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search messages, names, or order number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>

              <div className="flex items-center gap-2">
                {filters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeFilter === item
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Conversations
              </h2>

              <button
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Mark all read
              </button>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : paginatedConversations.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {paginatedConversations.map((conversation) => (
                  <Link
                    href={`/messages/${conversation.id}`}
                    key={conversation.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
                      conversation.unread > 0
                        ? "border-l-4 border-violet-500"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <Avatar conversation={conversation} />

                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {conversation.name}
                        </span>

                        {conversation.orderId && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                            #{conversation.orderId}
                          </span>
                        )}
                      </div>

                      <p className="truncate text-sm text-gray-500">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs text-gray-400">
                        {conversation.time}
                      </span>

                      {conversation.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-xs font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <span className="text-sm text-gray-500">
                {sortedConversations.length === 0
                  ? "No results found"
                  : `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                      currentPage * itemsPerPage,
                      sortedConversations.length
                    )} of ${sortedConversations.length}`}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}