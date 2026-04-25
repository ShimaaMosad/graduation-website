"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

export default function SecoundNavbar() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-[80px] bg-white shadow-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-[1200px] flex items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#3B82F6]">
          MySite
        </Link>

        {/* Search */}
        <div className="hidden md:flex relative w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[#3B82F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">

          {/* Messages */}
          <Link href="/messages">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </Link>

          {/* Notifications */}
          <Link href="/notifications" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2"
            >
              <Image
                src="/images/profile.jfif"
                alt="User"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg p-2">
                <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <User size={16} /> Profile
                </Link>

                <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <Settings size={16} /> Settings
                </Link>

                <button className="flex items-center gap-2 p-2 w-full hover:bg-gray-50 rounded text-left">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}