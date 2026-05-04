"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, MessageSquare, HelpCircle, Search } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────
interface FreelancerNavbarProps {
  notificationsCount?: number;
  messagesCount?: number;
}

// ─── Main Component ─────────────────────────────────────────
export default function FreelancerNavbar({
  notificationsCount = 12,
  messagesCount = 5,
}: FreelancerNavbarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const user = session?.user as any;
  const name  = user?.name  ?? "Ahmed Saleh";
  const image = user?.image ?? null;

  // Initials avatar fallback
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/freelancer/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-4 shadow-sm sticky top-0 z-50">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/" className="text-sm font-bold">
          <span className="text-gray-900">My</span>
          <span className="text-violet-600">Site</span>
        </Link>
        <span className="text-gray-200 font-light text-lg">|</span>
        <span className="text-sm font-semibold text-gray-700">
          Freelancer Panel
        </span>
      </div>

      {/* ── Search ── */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-xl mx-auto"
      >
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gigs, jobs, freelancers..."
            className="w-full pl-9 pr-16 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all placeholder:text-gray-400"
          />
          {/* ⌘K hint */}
          <kbd className="absolute right-3 text-[10px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Notifications */}
        <Link
          href="/freelancer/notifications"
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          )}
        </Link>

        {/* Messages */}
        <Link
          href="/freelancer/messages"
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Messages"
        >
          <MessageSquare size={18} />
          {messagesCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-violet-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {messagesCount > 99 ? "99+" : messagesCount}
            </span>
          )}
        </Link>

        {/* Help */}
        <Link
          href="/freelancer/support"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </Link>

        {/* Avatar */}
        <Link href="/freelancer/profile" className="ml-1">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-8 h-8 rounded-full object-cover border-2 border-violet-200 hover:border-violet-400 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center hover:bg-gray-700 transition-colors">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}