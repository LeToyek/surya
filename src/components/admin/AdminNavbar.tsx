// src/components/admin/AdminNavbar.tsx
'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
// import { useTheme } from '@/app/admin/layout'; // Import from AdminLayout
import { Menu, Search, Sun, Moon, Bell, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  userName: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, userName }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log(`Theme changed to: ${theme === 'light' ? 'dark' : 'light'}`);
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Search Bar - can be made functional later */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
          <div className="relative h-10 w-10">
            {/* Placeholder for user avatar */}
            {/* src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0ea5e9&color=fff`} */}
            <Image
            src={`https://ui-avatars.com/api/?name=handoko&background=0ea5e9&color=fff`}
              alt="User Avatar"
              className="rounded-full"
              width={40}
              height={40}
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-sm">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
