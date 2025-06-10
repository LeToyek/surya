// Example: src/components/auth/RouteGuard.tsx (Client Component)
'use client';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: Role[]; // Roles allowed for this route
  adminOnly?: boolean;
}

export function RouteGuard({ children, allowedRoles, adminOnly }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading auth state

    const publicPaths = ['/login', '/register']; // No guard needed for these

    if (publicPaths.includes(pathname)) {
        // If authenticated and trying to access login/register, redirect to home
        if (isAuthenticated) {
            router.replace('/');
        }
        return;
    }


    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`); // Redirect to login if not authenticated
      return;
    }

    // Role-based checks
    if (adminOnly && user?.role !== 'ADMIN') {
      router.replace('/unauthorized'); // Or home page
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role as Role)) {
      router.replace('/unauthorized'); // Or home page
      return;
    }

  }, [user, isAuthenticated, isLoading, router, pathname, allowedRoles, adminOnly]);

  // Render children only if checks pass or still loading (to avoid flicker)
  // Or add a more sophisticated loading/skeleton UI
  if (isLoading) return <p>Loading application...</p>; // Or a spinner component

  // If on a public path, or authenticated and authorized
  const isPublicPathForGuard = ['/login', '/register'].includes(pathname);
  if(isPublicPathForGuard && !isAuthenticated) return <>{children}</>;
  if(isPublicPathForGuard && isAuthenticated) return null; // Or redirect logic in useEffect handles it

  if (!isPublicPathForGuard && !isAuthenticated) return null; // Redirect logic in useEffect handles it

  if (adminOnly && (!isAuthenticated || user?.role !== 'ADMIN')) return null; // Redirected
  if (allowedRoles && (!isAuthenticated || !allowedRoles.includes(user?.role as Role))) return null; // Redirected


  return <>{children}</>;
}