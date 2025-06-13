// src/components/Navbar.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Menu, X, LogOut, ShieldCheck, } from 'lucide-react'; // Added icons
import { useAuth } from '@/hooks/useAuth'; // Adjust path

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' }, // Example anchor link
    { href: '/#news', label: 'News' },   // Example anchor link
    // Add other main navigation links here
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
              SolarSchools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-gray-700 hover:text-sky-600 transition-colors duration-200 font-medium">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-red-600 hover:text-red-800 transition-colors duration-200 font-medium flex items-center">
                     <ShieldCheck size={18} className="mr-1" /> Admin
                  </Link>
                )}
                {/* Could add a profile link e.g. /profile */}
                {/* <Link href="/profile" className="text-gray-700 hover:text-sky-600 font-medium flex items-center">
                    <UserCircle size={18} className="mr-1"/> {user?.name || 'Profile'}
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-1.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-sky-600 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="block py-2 text-gray-700 hover:text-sky-600 transition-colors rounded-md hover:bg-sky-50 px-3"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
             <hr className="my-2"/>
            {isAuthenticated ? (
              <>
                 {user?.role === 'ADMIN' && (
                  <Link href="/admin"
                    className="block py-2 text-red-600 hover:text-red-800 transition-colors rounded-md hover:bg-red-50 px-3 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                     <ShieldCheck size={18} className="mr-2" /> Admin Dashboard
                  </Link>
                )}
                 {/* <Link href="/profile"
                    className="block py-2 text-gray-700 hover:text-sky-600 transition-colors rounded-md hover:bg-sky-50 px-3 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle size={18} className="mr-2"/> {user?.name || 'Profile'}
                </Link> */}
                <button
                  onClick={handleLogout} // Logout function already closes menu
                  className="w-full text-left block py-2 text-red-500 hover:text-red-700 transition-colors rounded-md hover:bg-red-50 px-3 flex items-center"
                >
                   <LogOut size={18} className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="block py-2 text-gray-700 hover:text-sky-600 transition-colors rounded-md hover:bg-sky-50 px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href="/register"
                  className="block py-2 text-white bg-sky-500 hover:bg-sky-600 transition-colors rounded-md px-3 text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;