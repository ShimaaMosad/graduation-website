"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BarChart2, ShieldAlert,
  UserCog, CreditCard, ScrollText
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", path: "/analytics", icon: BarChart2 },
  { label: "Moderation", path: "/moderation", icon: ShieldAlert },
  { label: "User Management", path: "/usermanagement", icon: UserCog },
  { label: "Financials", path: "/financials", icon: CreditCard },
  { label: "System Logs", path: "/systemlogs", icon: ScrollText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-44 bg-[#1a1d2e] flex flex-col py-4 px-3">
        <div className="text-white mb-6 font-bold">MySite</div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              onClick={() => router.push(path)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition ${
                pathname === path
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
    </div>
  );
}