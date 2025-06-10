// src/app/admin/dashboard/page.tsx
'use client'; // For using hooks like useAuth if needed, or just for consistency
import React from 'react';
import { useAuth } from '@/hooks/useAuth'; // Adjust path
import Navbar from '@/components/Navbar'; // Assuming shared navbar
import Footer from '@/components/Footer'; // Assuming shared footer
import { ShieldCheck, Settings, Users, Briefcase } from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth(); // Can use to display admin name or further checks

  // The route guard in RootLayout should prevent non-admins from reaching here.
  // But as an additional check or for UI elements specific to admin:
  if (user?.role !== 'ADMIN') {
    // This typically shouldn't be reached if the guard is effective.
    // Could return a fallback or rely on the guard's redirect.
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Access restricted. Redirecting...</p>
        </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-20 px-4">
        <header className="max-w-7xl mx-auto py-8">
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
            <ShieldCheck className="h-12 w-12 text-sky-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name || 'Admin'}! Manage your SolarSchools platform.</p>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Admin Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Settings className="h-8 w-8 text-sky-500 mb-3" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Site Settings</h2>
              <p className="text-gray-600 text-sm">Configure global settings and platform parameters.</p>
              {/* <Link href="/admin/settings" className="text-sky-600 hover:underline mt-3 inline-block">Manage Settings</Link> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Users className="h-8 w-8 text-green-500 mb-3" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">User Management</h2>
              <p className="text-gray-600 text-sm">View, edit, or manage user accounts and roles.</p>
              {/* <Link href="/admin/users" className="text-green-600 hover:underline mt-3 inline-block">Manage Users</Link> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Briefcase className="h-8 w-8 text-purple-500 mb-3" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">School Projects</h2>
              <p className="text-gray-600 text-sm">Oversee and manage school solar panel projects.</p>
              {/* <Link href="/admin/projects" className="text-purple-600 hover:underline mt-3 inline-block">Manage Projects</Link> */}
            </div>
          </div>
          {/* More admin-specific content can go here */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboardPage;