"use client";

import { useState } from "react";
import Link from "next/link";

type Page = {
  name: string;
  path: string;
};

export default function Navigation() {
  const [openNav, setOpenNav] = useState(false);

  const pages: Page[] = [
    { name: "Browse jobs", path: "/browsejob" },
    { name: "Job Details", path: "/jobdetails" },
    { name: "Post a Job", path: "/postjob" },
    { name: "Submit Proposal", path: "/submitproposal" },
    { name: "View Proposals", path: "/viewproposal" },
    { name: "My posted jobs", path: "/postedjob" },
    { name: "Client profile", path: "/client" },
  ];

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">

      {/* Button */}
      <button
        onClick={() => setOpenNav(!openNav)}
        className="px-6 h-14 rounded-full bg-purple-600 text-white shadow-xl flex items-center gap-2 hover:scale-105 transition"
      >
        {openNav ? "✕ Close menu" : "☰ Navigate pages"}
      </button>

      {/* Dropdown */}
      {openNav && (
        <div className="mt-3 bg-white shadow-xl rounded-2xl w-52 p-2">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              onClick={() => setOpenNav(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-purple-50"
            >
              {page.name}
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}