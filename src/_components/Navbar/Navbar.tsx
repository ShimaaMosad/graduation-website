"use client";

import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  function logout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="container w-full lg:w-[80%] mx-auto px-4 h-14 flex flex-row justify-between items-center gap-4">

        {/* LEFT — Logo + links */}
        <div className="flex flex-row gap-6 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span>MySite</span>
          </Link>

          <Link href="/" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
            Home
          </Link>

          {/* Only show Gigs / Browse Jobs for unauthenticated visitors */}
          {!session && (
            <>
              <Link href="/gigs" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Gigs
              </Link>
              <Link href="/browsejob" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                Browse Jobs
              </Link>
            </>
          )}

          <Link href="/support" className="text-sm text-gray-700 hover:text-indigo-600 transition-colors">
            Support
          </Link>
        </div>

        {/* RIGHT — Auth actions */}
        <div className="flex flex-row gap-3 items-center">
          {!session ? (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 transition-all"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-all"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}