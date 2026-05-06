import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─────────────────────────────────────────────────────────────────────────────
// Route Groups
// ─────────────────────────────────────────────────────────────────────────────

/** Accessible to everyone — no auth required */
const PUBLIC_ROUTES = [
  "/",
  "/homepage",
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/change-password",
  "/profile-setup",
  "/gigs",
  "/browsejob",
  "/search",
  "/support",
];

/** Freelancers only — clients are redirected to /home */
const FREELANCER_ONLY_ROUTES = [
  "/freelancer",           // covers /freelancer/create-gig, /freelancer/mygigs, etc.
  "/earnings",
  "/submitproposal",
  "/atsresult",
  "/makecv",
  "/my-gigs",
  "/projects",
  "/analytics",
];

/** Clients only — freelancers are redirected to /freelancer */
const CLIENT_ONLY_ROUTES = [
  "/client",
  "/home",
  "/create-post",
  "/postjob",
  "/jobs",
  "/jobdetails",
  "/dashboard",
  "/escrow",
  "/payment",
];

/** Both roles can access — requires authentication */
const SHARED_PROTECTED_ROUTES = [
  "/messages",
  "/orders",
  "/reviews",
  "/notifications",
  "/history",
  "/settings",
  "/preferences",
  "/profile",
  "/collaboration",
  "/financials",
  "/usermanagement",
  "/ai-interview",
  "/interview-result",
];

/** Admin only — all other roles redirected to their dashboard */
const ADMIN_ONLY_ROUTES = ["/moderation"];

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function roleDashboard(role: string | undefined): string {
  if (role === "freelancer") return "/freelancer";
  if (role === "admin") return "/moderation";
  return "/home"; // client default
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // API routes use their own auth logic
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // ── 1. Public routes ────────────────────────────────────────────────────────
  if (matchRoute(pathname, PUBLIC_ROUTES)) {
    // Redirect already-authenticated users away from login / register
    if (
      (pathname === "/login" || pathname === "/register") &&
      isAuthenticated
    ) {
      return NextResponse.redirect(
        new URL(roleDashboard(userRole), request.url)
      );
    }
    return NextResponse.next();
  }

  // ── 2. All remaining routes require authentication ──────────────────────────
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Admin-only routes ────────────────────────────────────────────────────
  if (matchRoute(pathname, ADMIN_ONLY_ROUTES) && userRole !== "admin") {
    return NextResponse.redirect(
      new URL(roleDashboard(userRole), request.url)
    );
  }

  // ── 4. Freelancer-only routes — redirect clients ────────────────────────────
  if (
    matchRoute(pathname, FREELANCER_ONLY_ROUTES) &&
    userRole === "client"
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ── 5. Client-only routes — redirect freelancers ────────────────────────────
  if (
    matchRoute(pathname, CLIENT_ONLY_ROUTES) &&
    userRole === "freelancer"
  ) {
    // Special case: postjob → browsejob makes semantic sense
    const dest = pathname === "/postjob" ? "/browsejob" : "/freelancer";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── 6. Shared protected routes — authenticated, role doesn't matter ─────────
  if (matchRoute(pathname, SHARED_PROTECTED_ROUTES)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Matcher
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};