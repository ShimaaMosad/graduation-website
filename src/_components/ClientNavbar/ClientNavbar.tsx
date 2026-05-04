"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, HelpCircle, Search, Plus, ChevronDown } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TopbarProps {
  /** Page-level heading, e.g. "Welcome back, Sara" */
  title?: string;
  /** Sub-heading below the title */
  subtitle?: string;
  /** Primary CTA label */
  ctaLabel?: string;
  onCtaClick?: () => void;
}

// ── Topbar ────────────────────────────────────────────────────────────────────

export default function ClientNavbar({
  title = "Welcome back, Sara",
  subtitle = "Here's what's happening with your projects today.",
  ctaLabel = "Create New Job",
  onCtaClick,
}: TopbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ── Sticky top nav bar (MySite-style) ── */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-100 bg-white px-6 shadow-sm">

        {/* Logo — shown when sidebar is hidden / mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth={2.2}>
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path strokeLinecap="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <span className="text-sm font-bold text-blue-600">MySite Client</span>
        </div>

        {/* Search bar */}
        <div className="relative flex flex-1 items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Find a freelancer or service..."
            className="h-9 w-full max-w-md rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">

          {/* CTA button */}
          <button
            onClick={onCtaClick}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Plus size={15} />
            {ctaLabel}
          </button>

          {/* Notifications */}
          <IconButton badge={7}>
            <Bell size={18} />
          </IconButton>

          {/* Messages */}
          <IconButton badge={3}>
            <MessageSquare size={18} />
          </IconButton>

          {/* Help */}
          <IconButton>
            <HelpCircle size={18} />
          </IconButton>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-slate-200" />

          {/* Profile avatar dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 p-0.5 pr-2 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                SJ
              </span>
              <ChevronDown
                size={13}
                className={`text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
                {["Profile", "Settings", "Billing", "Sign out"].map((item) => (
                  <button
                    key={item}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      item === "Sign out"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

    </>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function IconButton({ children, badge }: { children: React.ReactNode; badge?: number }) {
  return (
    <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
      {children}
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}