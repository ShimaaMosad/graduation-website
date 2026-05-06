"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, HelpCircle, MessageSquare, PlusCircle, Search } from "lucide-react";

export default function FreelancerNavbar({
  notificationsCount = 12,
  messagesCount = 5,
}: {
  notificationsCount?: number;
  messagesCount?: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const user = session?.user as any;
  const name: string = user?.name ?? "Freelancer";
  const image: string | null = user?.image ?? null;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-4 shadow-sm sticky top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/projects" className="text-sm font-bold">
          <span className="text-gray-900">My</span>
          <span className="text-violet-600">Site</span>
        </Link>
        <span className="text-gray-200 font-light text-lg">|</span>
        <span className="text-sm font-semibold text-gray-700">Freelancer Panel</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, gigs, clients..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all placeholder:text-gray-400"
          />
        </div>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href="/freelancer/create-gig"
          className="hidden md:flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <PlusCircle size={15} />
          Add Gig
        </Link>

        <Link
          href="/notifications"
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

        <Link
          href="/messages"
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

        <Link
          href="/support"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </Link>

        <Link href="/profile" className="ml-1">
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

        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}