// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AuthenticatedUser } from './types'; // Adjust path if types.ts is not in src

// Function to parse the mock user from cookie (or localStorage if accessible, but middleware runs server-side typically)
// For this example, we'll assume the client sets a simple cookie on login/logout for middleware to check.
// This is a simplified approach. Real JWTs are usually stored in httpOnly cookies.
// Alternatively, for client-side routing protection with App Router, you'd use layout checks.
// But middleware is good for API routes and initial server-side checks.

// For pure client-side mock with localStorage, middleware can't directly access it.
// So, this middleware example will be more conceptual or would require a cookie.
// Let's assume on login, we set a cookie 'currentUserRole' and 'isAuthenticatedFlag'.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Attempt to get user info (this is tricky with localStorage in middleware)
  // For a pure client-side mock, most protection logic would be in a top-level client component or layout.
  // Middleware is more for if you were setting a cookie or header that it can read.
  // For demonstration, let's pretend we have a way to know the role from cookies.
  const currentUserCookie = request.cookies.get('currentUser'); // This is how you'd get a cookie
  let user: AuthenticatedUser | null = null;
  if (currentUserCookie) {
    try {
      user = JSON.parse(currentUserCookie.value) as AuthenticatedUser;
    } catch (e) { console.error("Error parsing user cookie in middleware", e); }
  }


  const isAuthenticated = !!user;
  const userRole = user?.role || 'PUBLIC';

  // Publicly accessible paths
  const publicPaths = ['/login', '/register', '/', '/schools']; // Add any other public paths like /schools/[id]

  // Check if current path is a dynamic school detail page
  const isSchoolDetailPage = /^\/schools\/[^/]+$/.test(pathname);

  if (publicPaths.includes(pathname) || isSchoolDetailPage || pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.includes('.')) {
    // Allow access to public paths, static files, API routes etc.
    return NextResponse.next();
  }


  // --- Protection Logic ---

  // If trying to access any protected route and not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log(`Middleware: Not authenticated, trying to access ${pathname}. Redirecting to /login.`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      console.log(`Middleware: User role ${userRole} trying to access admin path ${pathname}. Redirecting to home.`);
      // Forbidden or redirect to a "not authorized" page or home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // User-specific routes (e.g., /profile, /my-donations) - can be added later
  // if (pathname.startsWith('/profile')) {
  //   if (userRole !== 'USER' && userRole !== 'ADMIN') { // Assuming ADMIN can also view profiles
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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

// IMPORTANT NOTE FOR MOCKING:
// Middleware runs on the server/edge. It CANNOT directly access `localStorage`.
// For the above middleware to work with the `localStorage`-based AuthContext,
// on login, `AuthContext` would also need to set a cookie that the middleware can read.
// Example in AuthContext login:
// document.cookie = `currentUser=${JSON.stringify(foundUser)}; path=/; max-age=86400;`; // Set cookie
// And on logout:
// document.cookie = 'currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'; // Clear cookie

// For now, if you are relying purely on client-side state with localStorage,
// you'd implement route protection within client components (e.g., in a RootLayout client component
// or individual page client components checking useAuth()).
// The middleware example above is structured for when you start using cookies for auth state.