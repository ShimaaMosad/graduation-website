"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";

export default function ClientNavbar({
  ctaLabel = "Make a Post",
}: {
  ctaLabel?: string;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-100 bg-white px-6 shadow-sm">
      {/* Logo */}
      <Link href="/home" className="hidden items-center gap-2 lg:flex shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold">
          M
        </div>
        <span className="text-sm font-bold text-blue-600">MySite</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex flex-1 items-center">
        <Search size={15} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search gigs or freelancers..."
          className="h-9 w-full max-w-md rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/create-post"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus size={15} />
          {ctaLabel}
        </Link>

        <IconLink href="/notifications" badge={7} ariaLabel="Notifications">
          <Bell size={18} />
        </IconLink>

        <IconLink href="/messages" badge={3} ariaLabel="Messages">
          <MessageSquare size={18} />
        </IconLink>

        <IconLink href="/support" ariaLabel="Help">
          <HelpCircle size={18} />
        </IconLink>

        <div className="mx-1 h-6 w-px bg-slate-200" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 p-0.5 pr-2 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              CL
            </span>
            <ChevronDown
              size={13}
              className={`text-slate-500 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/notifications"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setProfileOpen(false)}
              >
                Notifications
              </Link>
              <Link
                href="/support"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setProfileOpen(false)}
              >
                Support
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function IconLink({
  children,
  badge,
  href,
  ariaLabel,
}: {
  children: React.ReactNode;
  badge?: number;
  href: string;
  ariaLabel: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}