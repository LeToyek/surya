'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { LayoutDashboard, Users, School, Settings, Megaphone } from 'lucide-react';
import type { NavItem } from '@/types';
import { ThemeProvider } from '../providers';

// Define the navigation items for the admin sidebar
const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { title: 'Users', icon: Users, href: '/admin/users' },
  { title: 'Marketing', icon: Megaphone, href: '/admin/marketing' },
  {
    title: 'Schools', icon: School, href: '/admin/schools',
    children: [
      { title: 'All Schools', href: '/admin/schools' },
      { title: 'Add New', href: '/admin/schools/new' },
    ]
  },
  { title: 'Settings', icon: Settings, href: '/admin/settings' },
];

// Footer Component
const Footer = () => {
  return (
    <footer className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <p>Copyright &copy; {new Date().getFullYear()} Solar by molana.my.id</p>
    </footer>
  );
};


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // This layout is wrapped by the root layout, so middleware/guards should handle redirects.
  // We add a client-side check as a fallback.
  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.replace('/unauthorized');
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'ADMIN') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar
          isOpen={isSidebarOpen}
          navItems={navItems}
        />
        <div className="flex flex-1 flex-col transition-all duration-300">
          <AdminNavbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            userName={user?.name || 'Admin'}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
          {/* Footer has been added here */}
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}