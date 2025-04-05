import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

// Paths that don't require authentication
const publicPaths = ["/", "/login"];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If not logged in and trying to access a protected route, redirect to login
  if (!session.isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (session.isLoggedIn && isPublicPath) {
    // Determine where to redirect based on user type
    // This would require storing user type in the session
    // For now, redirect to dashboard as default
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (we'll handle auth in the API routes themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|imgs|api).*)",
  ],
};
