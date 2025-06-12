// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AuthenticatedUser } from './types'; // Adjust path if needed

// This function will run on every matching request before it reaches the page.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Attempt to get the user data from the 'session' cookie
  const sessionCookie = request.cookies.get('session');
  let user: AuthenticatedUser | null = null;

  if (sessionCookie) {
    try {
      // Parse the cookie value to get the user object
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error("Error parsing session cookie in middleware:", e);
      // The cookie is malformed, treat the user as logged out.
      user = null;
    }
  }

  // 2. Determine authentication status and role
  const isAuthenticated = !!user;
  const userRole = user?.role || 'PUBLIC'; // Default to 'PUBLIC' if no user

  // 3. Define public routes that do not require authentication
  // We use regex for dynamic paths like /schools/[id]
  const publicPaths = [
    /^\/$/, // Homepage
    /^\/login$/,
    /^\/register$/,
    /^\/schools(\/[^/]+)?$/, // Matches /schools and /schools/[id]
    /^\/unauthorized$/,
  ];

  // 4. Define admin-only routes
  const adminPaths = [
    /^\/admin(\/.*)?$/, // Matches /admin and any sub-path like /admin/dashboard
  ];

  // Allow Next.js internal requests, API routes, and static files to pass through
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 5. Enforce routing rules
  const isPublic = publicPaths.some(regex => regex.test(pathname));
  const isAdminPath = adminPaths.some(regex => regex.test(pathname));

  // If trying to access a protected route and is NOT authenticated, redirect to login
  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Optional: add redirect query
    console.log(`Middleware: Not authenticated for path ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access an admin-only route and is NOT an admin, redirect to an 'unauthorized' page
  if (isAdminPath && userRole !== 'ADMIN') {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    console.log(`Middleware: Non-admin user (role: ${userRole}) on admin path ${pathname}. Redirecting to unauthorized.`);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // 6. If all checks pass, allow the request to continue
  return NextResponse.next();
}

// Configure the matcher to run the middleware on all routes except for static assets and API calls.
// This is generally more efficient than running on every single request.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};