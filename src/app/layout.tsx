// src/app/layout.tsx
'use client'; // Make RootLayout a client component to use hooks
import { useAuth } from "@/hooks/useAuth";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Adjust path
import { Inter } from "next/font/google";
import { usePathname, useRouter }
from "next/navigation";
import { useEffect, ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

// No metadata export from client component directly. Move to a server component if needed or keep in page.tsx

function AppInitializer({ children }: { children: ReactNode }) {
  const { createAdminUserIfNotExists } = useAuth();
  useEffect(() => {
    createAdminUserIfNotExists(); // Ensure admin exists on app load
  }, [createAdminUserIfNotExists]);
  return <>{children}</>;
}


function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    const adminRoutes = ['/admin']; // Add more specific admin routes like /admin/users etc.
    const authRoutes = ['/login', '/register'];

    if (!isAuthenticated && !authRoutes.includes(pathname) && pathname !== '/' && !pathname.startsWith('/schools/') && pathname !== '/unauthorized') {
      // If not authenticated and trying to access a protected route (that's not explicitly public like home or schools)
      console.log(`RouteGuard: Not authenticated for path ${pathname}, redirecting to login.`);
      router.replace(`/login?redirect=${pathname}`);
    } else if (isAuthenticated && authRoutes.includes(pathname)) {
      // If authenticated and trying to access login/register, redirect to home
      console.log(`RouteGuard: Authenticated user on auth path ${pathname}, redirecting to home.`);
      router.replace('/');
    } else if (adminRoutes.some(route => pathname.startsWith(route)) && user?.role !== 'ADMIN') {
      // If trying to access admin route and not an admin
      console.log(`RouteGuard: Non-admin user (role: ${user?.role}) on admin path ${pathname}, redirecting to unauthorized.`);
      router.replace('/unauthorized');
    }

  }, [isAuthenticated, user, isLoading, pathname, router]);


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading application...</p></div>;
  }

  // Basic rendering logic, can be enhanced
  // If trying to access admin route without being admin, and not loading, show nothing (redirect will happen)
  if (pathname.startsWith('/admin') && user?.role !== 'ADMIN' && !isLoading) return null;


  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppInitializer> {/* Ensures admin creation logic runs early */}
            <ProtectedRoutes>
                 {/* Navbar and Footer could go here if they are part of every page */}
                {children}
            </ProtectedRoutes>
          </AppInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}