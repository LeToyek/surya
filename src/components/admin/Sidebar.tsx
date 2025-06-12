// src/components/admin/Sidebar.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, ChevronDown } from 'lucide-react';
import type { NavItem } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navItems }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (itemTitle: string) => {
    setOpenSubmenus(prev => ({ ...prev, [itemTitle]: !prev[itemTitle] }));
  };
  
  return (
    <aside className={`flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-lg text-sky-600 dark:text-sky-400 transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>Admin</span>
        </Link>
      </div>
      <nav className="mt-4 px-2">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const isSubmenuOpen = openSubmenus[item.title] ?? false;

            return (
              <li key={item.title} className="my-1">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-6 w-6 flex-shrink-0" />
                        <span className={`ml-4 font-medium transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>{item.title}</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''} ${!isOpen && 'hidden'}`} />
                    </button>
                    {isSubmenuOpen && isOpen && (
                      <ul className="pl-8 py-2 space-y-1">
                        {item.children.map(child => {
                          const isChildActive = pathname === child.href;
                          return (
                          <li key={child.title}>
                            <Link href={child.href} className={`flex items-center p-2 rounded-md text-sm transition-colors ${isChildActive ? 'text-sky-600 dark:text-sky-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                              {child.title}
                            </Link>
                          </li>
                        )})}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-4 font-medium transition-opacity duration-200 ${!isOpen && 'opacity-0'}`}>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
