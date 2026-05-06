"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  Briefcase,
  Clock,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  PlusSquare,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/home", icon: <LayoutDashboard size={18} /> },
  { label: "Make a Post", href: "/create-post", icon: <PlusSquare size={18} /> },
  { label: "Browse Jobs", href: "/browsejob", icon: <Briefcase size={18} /> },
  { label: "My Jobs", href: "/jobs", icon: <Briefcase size={18} /> },
  { label: "Messages", href: "/messages", icon: <Mail size={18} />, badge: 5 },
  { label: "Search", href: "/search", icon: <Search size={18} /> },
  { label: "Orders", href: "/orders", icon: <ShoppingCart size={18} />, badge: 2 },
  { label: "History", href: "/history", icon: <Clock size={18} /> },
  { label: "Escrow", href: "/escrow", icon: <ShieldCheck size={18} /> },
  { label: "Payment", href: "/checkout/payment", icon: <CreditCard size={18} /> },
  { label: "Notifications", href: "/notifications", icon: <Bell size={18} /> },
  { label: "Profile", href: "/profile", icon: <User size={18} /> },
  { label: "Support", href: "/support", icon: <HelpCircle size={18} /> },
];

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1.5 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

export default function ClientSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-100 bg-white font-sans sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white font-bold">
          M
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-violet-600">Client Portal</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Managing Projects
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
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
                  <span
                    className={
                      isActive
                        ? "text-violet-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge !== undefined && <Badge count={item.badge} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade card */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-4 text-white shadow-lg shadow-violet-200">
        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-violet-200">
          Account
        </p>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-300" />
          <p className="text-sm font-bold">Upgrade to Pro</p>
        </div>
        <Link
          href="/checkout/payment"
          className="block w-full rounded-xl bg-white py-2 text-center text-xs font-bold text-violet-700 transition hover:bg-violet-50"
        >
          View Pricing
        </Link>
      </div>

      {/* Sign out */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}