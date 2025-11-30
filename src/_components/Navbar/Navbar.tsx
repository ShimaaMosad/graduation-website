"use client"
import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { data: session } = useSession()

  function logout() {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container w-full lg:w-[80%] mx-auto p-4 flex  lg:flex-row justify-between items-center gap-4">
        
      {/* LEFT LINKS */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 hover:text-gray-800 transition-colors">
          <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg">
            ✨
          </div>
          <span>MySite</span>
        </Link>
        <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</Link>
        <Link href="/change-password" className="text-gray-700 hover:text-indigo-600 transition-colors">Update Profile</Link>
      </div>

        {/* RIGHT LINKS */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {!session ? (
            <>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-purple-500 hover:to-indigo-500 transition-all">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all">
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <Button onClick={logout} className="bg-red-500 text-white hover:bg-red-600 transition-all">
              Signout
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
