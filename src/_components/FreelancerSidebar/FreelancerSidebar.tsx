"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Zap,
  BookCopy,
  Mail,
  Search,
  ClipboardList,
  Wallet,
  UserCircle,
  Settings,
  LogOut,
  TrendingUp,
  BarChart3,
  FileText,
  Star,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

const navItems: NavItem[] = [
  { label: "Projects", href: "/projects", icon: <LayoutDashboard size={18} /> },
  { label: "Analytics", href: "/analytics", icon: <BarChart3 size={18} /> },
  { label: "Make CV", href: "/makecv", icon: <FileText size={18} /> },
  { label: "My Gigs", href: "/my-gigs", icon: <BookCopy size={18} />, badge: 8 },
  { label: "Messages", href: "/messages", icon: <Mail size={18} />, badge: 5 },
  { label: "Search", href: "/search", icon: <Search size={18} /> },
  { label: "Orders", href: "/orders", icon: <ClipboardList size={18} />, badge: 15 },
  { label: "Earnings", href: "/earnings", icon: <Wallet size={18} /> },
  { label: "Financials", href: "/financials", icon: <TrendingUp size={18} /> },
  { label: "Submit Proposal", href: "/submitproposal", icon: <Zap size={18} /> },
  { label: "Reviews", href: "/reviews", icon: <Star size={18} /> },
  { label: "Profile", href: "/profile", icon: <UserCircle size={18} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={18} /> },
];

function Badge({ value }: { value: number | string }) {
  const isNew = value === "New";
  return (
    <span
      className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
        isNew ? "bg-blue-600 text-white" : "bg-violet-600 text-white"
      }`}
    >
      {value}
    </span>
  );
}

export default function FreelancerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as any;
  const name: string = user?.name ?? "Ahmed Saleh";
  const title: string = user?.title ?? "Expert UI Designer";
  const image: string | null = user?.image ?? null;

  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0">
      {/* Brand header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <p className="text-xs font-bold tracking-widest text-violet-600 uppercase">
          Freelancer Portal
        </p>
        <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">
          Active Talent
        </p>
      </div>

      {/* Profile card */}
      <div className="flex flex-col items-center px-6 py-5 border-b border-gray-100">
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-violet-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl border-2 border-violet-200">
              {name.charAt(0)}
            </div>
          )}
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        <p className="mt-3 font-semibold text-gray-800 text-sm">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{title}</p>

        <div className="flex gap-2 mt-3">
          <span className="flex items-center gap-1 text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
            ✦ AI Verified
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            ☆ Top Seller
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-50 text-violet-600 border-l-2 border-violet-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive ? "text-violet-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge !== undefined && <Badge value={item.badge} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Earnings widget */}
      <div className="mx-3 mb-3 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Monthly Earnings
          </p>
          <TrendingUp size={14} className="text-violet-500" />
        </div>
        <p className="text-2xl font-bold text-gray-800">
          $1,840{" "}
          <span className="text-xs font-semibold text-green-500">+12%</span>
        </p>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Monthly Goal</span>
            <span>74%</span>
          </div>
          <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
              style={{ width: "74%" }}
            />
          </div>
        </div>
        <Link
          href="/earnings"
          className="mt-3 block w-full text-center text-xs font-semibold text-violet-600 border border-violet-300 rounded-lg py-2 hover:bg-violet-600 hover:text-white transition-all"
        >
          View Earnings
        </Link>
      </div>

      {/* Sign out */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}