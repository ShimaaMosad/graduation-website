import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const publicPaths = ["/login", "/register", "/forget-password"];
  const privatePaths = ["/change-password"];

  const currentPath = request.nextUrl.pathname;

  if (token) {
    if (publicPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    if (privatePaths.includes(currentPath)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/change-password"
  ],
};
