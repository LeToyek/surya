// src/app/admin/page.tsx
'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Users, DollarSign, Activity, TrendingUp, School } from 'lucide-react';

// Example Stat Card component
const StatCard = ({ title, value, icon: Icon, change, changeType }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <div className={`mt-2 flex items-center text-xs ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>{change}</span>
        <span className="ml-1 text-gray-400">vs last month</span>
      </div>
    </div>
    <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-full">
      <Icon className="h-6 w-6 text-sky-600 dark:text-sky-300" />
    </div>
  </div>
);


const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name || 'Admin'}!</p>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Donations" value="$125,670" icon={DollarSign} change="+12.5%" changeType="increase" />
        <StatCard title="Active Schools" value="34" icon={School} change="-2.1%" changeType="decrease" />
        <StatCard title="Registered Users" value="1,284" icon={Users} change="+250" changeType="increase" />
        <StatCard title="Donations this Month" value="$15,230" icon={Activity} change="+8.3%" changeType="increase" />
      </div>

      {/* Other sections can go here, e.g., charts, recent activity tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
           <h3 className="text-lg font-semibold mb-4">Donation Overview</h3>
           {/* Placeholder for a chart */}
           <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
             <p className="text-gray-500">Chart will be displayed here.</p>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            {/* Placeholder for recent activities feed */}
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{`User 'jane.doe@email.com' just donated $50.`}</p>
              <p className="text-sm text-gray-500">{`School 'Riverside High' reached its goal.`}</p>
              <p className="text-sm text-gray-500">{`New user 'john.smith@email.com' registered.`}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
