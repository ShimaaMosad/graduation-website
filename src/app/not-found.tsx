"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Search, Users, WalletCards } from "lucide-react";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const value = query.trim();
    if (!value) return;
    router.push(`/services?search=${encodeURIComponent(value)}`);
  };

  return (
    <main className="min-h-screen bg-[#fbf5ff] text-[#191724]">
      <section
        className="mx-auto flex flex-col items-center"
        style={{
          width: "80%",
          maxWidth: "1180px",
          minHeight: "calc(100vh - 92px)",
          paddingTop: "95px",
          paddingBottom: "55px",
        }}
      >
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full"
            style={{
              width: "440px",
              height: "150px",
              background:
                "linear-gradient(90deg, #ddd6fe, #fae8ff, #bfdbfe)",
              filter: "blur(28px)",
              opacity: 0.9,
            }}
          />

          <h2
            className="relative font-extrabold text-[#6d35d8]"
            style={{
              fontSize: "155px",
              lineHeight: "0.9",
              letterSpacing: "-12px",
            }}
          >
            404
          </h2>
        </div>

        <h1
          className="text-center font-extrabold"
          style={{ fontSize: "42px", marginTop: "12px" }}
        >
          Oops! Page Not Found
        </h1>

        <p
          className="max-w-[650px] text-center text-slate-700"
          style={{ fontSize: "19px", lineHeight: "32px", marginTop: "12px" }}
        >
          The page you're looking for has gone on vacation or never existed
          <br />
          in the first place.
        </p>

        <div style={{ width: "68%", minWidth: "620px", marginTop: "38px" }}>
          <p className="mb-2 text-[16px] text-slate-700">
            Try searching for what you need:
          </p>

          <div className="flex h-[58px] items-center rounded-full border border-violet-200 bg-white px-5 shadow-sm">
            <Search className="h-5 w-5 text-slate-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search services, jobs, or help..."
              className="h-full flex-1 bg-transparent px-4 text-[18px] outline-none placeholder:text-slate-400"
            />

            <button
              onClick={handleSearch}
              className="rounded-full bg-violet-700 px-8 py-3 text-[15px] font-semibold text-white hover:bg-violet-800"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-violet-100 px-7 py-3 text-[15px] text-slate-700">
            Home
          </Link>

          <Link href="/services" className="rounded-full bg-violet-100 px-7 py-3 text-[15px] text-slate-700">
            Browse Gigs
          </Link>

          <Link href="/post-job" className="rounded-full bg-violet-100 px-7 py-3 text-[15px] text-slate-700">
            Post a Job
          </Link>

          <Link href="/support" className="rounded-full bg-violet-100 px-7 py-3 text-[15px] text-slate-700">
            Support
          </Link>
        </div>

        <div style={{ width: "100%", marginTop: "58px" }}>
          <h2 className="mb-7 text-[32px] font-bold">Popular Pages</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Link
              href="/services"
              className="rounded-xl border border-violet-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={{ height: "190px" }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
                <Briefcase className="h-6 w-6" />
              </div>

              <h3 className="text-[23px] font-bold">Browse Services</h3>

              <p className="mt-2 text-[16px] leading-6 text-slate-700">
                Explore top-rated freelancers and specialized services.
              </p>
            </Link>

            <Link
              href="/browse-talent"
              className="rounded-xl border border-violet-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={{ height: "190px" }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="text-[23px] font-bold">Find a Freelancer</h3>

              <p className="mt-2 text-[16px] leading-6 text-slate-700">
                Connect with independent talent ready to work.
              </p>
            </Link>

            <Link
              href="/escrow"
              className="rounded-xl border border-violet-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={{ height: "190px" }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-700 text-white">
                <WalletCards className="h-6 w-6" />
              </div>

              <h3 className="text-[23px] font-bold">How Payments Work</h3>

              <p className="mt-2 text-[16px] leading-6 text-slate-700">
                Learn about our secure milestone-based payment system.
              </p>
            </Link>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-10 flex items-center gap-2 text-[16px] font-medium text-violet-700 hover:text-violet-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Go back to previous page
        </button>
      </section>

      <footer className="flex h-[92px] items-center justify-between border-t border-violet-100 bg-white px-7">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[22px] font-bold">
            MySite
          </Link>

          <span className="text-sm text-slate-500">
            © 2024 MySite AI. Empowering the global workforce.
          </span>
        </div>

        <div className="flex gap-8 text-sm text-slate-600">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/security">Security</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  );
}