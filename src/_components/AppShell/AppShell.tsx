"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../Navbar/Navbar";
import ClientNavbar from "../ClientNavbar/ClientNavbar";
import ClientSidebar from "../ClientSidebar/ClientSidebar";
import FreelancerNavbar from "../FreelancerNavbar/FreelancerNavbar";
import FreelancerSidebar from "../FreelancerSidebar/FreelancerSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as
    | "client"
    | "freelancer"
    | "admin"
    | undefined;

  // ─────────────────────────────────────────────────────────────────────────
  // 1.  NO LAYOUT — auth & standalone pages render themselves
  // ─────────────────────────────────────────────────────────────────────────
  const noLayoutRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/change-password",
    "/verify",
    "/profile-setup",
    "/ai-interview",
    "/interview-result",
    "/atsresult",       // standalone ATS result page
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 2.  PUBLIC NAVBAR — unauthenticated visitors see a top Navbar only
  // ─────────────────────────────────────────────────────────────────────────
  const publicRoutes = [
    "/",
    "/homepage",
    "/gigs",
    "/browsejob",
    "/search",
    "/support",
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 3.  FREELANCER-EXCLUSIVE routes
  // ─────────────────────────────────────────────────────────────────────────
  const freelancerExclusiveRoutes = [
    "/freelancer",          // /freelancer/create-gig, /freelancer/mygigs …
    "/projects",
    "/analytics",
    "/earnings",
    "/financials",
    "/submitproposal",
    "/makecv",
    "/my-gigs",
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 4.  CLIENT-EXCLUSIVE routes
  // ─────────────────────────────────────────────────────────────────────────
  const clientExclusiveRoutes = [
    "/home",
    "/create-post",
    "/postjob",
    "/jobs",
    "/jobdetails",
    "/escrow",
    "/checkout",           // /checkout/payment
    "/dashboard",
    "/client",
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 5.  SHARED ROUTES — layout resolved by session role
  // ─────────────────────────────────────────────────────────────────────────
  const sharedRoutes = [
    "/messages",
    "/orders",
    "/reviews",
    "/notifications",
    "/history",
    "/settings",
    "/preferences",
    "/profile",
    "/collaboration",
    "/usermanagement",
    "/moderation",
  ];

  // ── Helper ────────────────────────────────────────────────────────────────
  const match = (routes: string[]) =>
    routes.some((r) => pathname === r || pathname.startsWith(r + "/"));

  // ── Priority 1: No layout ─────────────────────────────────────────────────
  if (match(noLayoutRoutes)) return <>{children}</>;

  // ── Priority 2: Public layout ─────────────────────────────────────────────
  if (match(publicRoutes)) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  // ── Priority 3: Avoid layout flash while session is resolving ─────────────
  if (status === "loading") {
    return <div className="min-h-screen bg-[#f5f6f8]">{children}</div>;
  }

  // ── Resolve layout ────────────────────────────────────────────────────────
  const showFreelancerLayout =
    match(freelancerExclusiveRoutes) ||
    (match(sharedRoutes) && role === "freelancer");

  const showClientLayout =
    match(clientExclusiveRoutes) ||
    (match(sharedRoutes) && (role === "client" || role === "admin"));

  // ── Priority 4: Freelancer layout ─────────────────────────────────────────
  if (showFreelancerLayout) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex">
        <FreelancerSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <FreelancerNavbar />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    );
  }

  // ── Priority 5: Client layout ──────────────────────────────────────────────
  if (showClientLayout) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex">
        <ClientSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <ClientNavbar />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    );
  }

  // ── Fallback — unknown / unauthenticated route ────────────────────────────
  return <>{children}</>;
}