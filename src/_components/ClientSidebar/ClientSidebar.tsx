"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  Briefcase,
  Mail,
  Search,
  ShoppingCart,
  CreditCard,
  Sparkles,
  HelpCircle,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Post Job",  href: "/post-job",  icon: <PlusSquare size={18} /> },
  { label: "My Jobs",   href: "/my-jobs",   icon: <Briefcase size={18} />, badge: 3 },
  { label: "Messages",  href: "/messages",  icon: <Mail size={18} />,      badge: 5 },
  { label: "Search",    href: "/search",    icon: <Search size={18} /> },
  { label: "Orders",    href: "/orders",    icon: <ShoppingCart size={18} />, badge: 2 },
  { label: "Payment",   href: "/payment",   icon: <CreditCard size={18} /> },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1.5 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-100 bg-white font-sans">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
          {/* rocket icon */}
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96a14.926 14.926 0 0 1-5.96 2.91m0 0a15.055 15.055 0 0 1-5.16-4.07M5.45 8.7A14.985 14.985 0 0 0 3.27 14.7a14.985 14.985 0 0 0 9.41 2.24" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-violet-600">Client Portal</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Managing Projects
          </p>
        </div>
      </div>

      {/* ── User card ── */}
      <div className="mx-4 mb-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/40?img=47"
            alt="Sara Chen"
            className="h-9 w-9 rounded-full object-cover"
          />
          {/* online dot */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Sara Chen</p>
          <span className="rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            Verified Client
          </span>
        </div>
      </div>

      {/* ── Main Menu ── */}
      <nav className="flex-1 px-3">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {/* active accent bar */}
                  <span
                    className={`flex h-5 w-5 items-center justify-center transition-colors ${
                      isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge !== undefined && <Badge count={item.badge} />}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-600" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Upgrade banner ── */}
      <div className="mx-4 mb-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-4 text-white shadow-lg shadow-violet-200">
        {/* decorative blob */}
        <div className="pointer-events-none absolute right-3 top-2 h-16 w-16 rounded-full bg-white/10 blur-2xl" />

        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-violet-200">
          Account
        </p>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-300" />
          <p className="text-sm font-bold">Upgrade to Pro</p>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-violet-200">
          Unlock advanced project analytics and priority support.
        </p>
        <button className="w-full rounded-xl bg-white py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-50">
          View Pricing
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-[11px] text-slate-400">© 2024 Client Portal</p>
        <button className="text-slate-400 hover:text-slate-600">
          <HelpCircle size={14} />
        </button>
      </div>
    </aside>
  );
}