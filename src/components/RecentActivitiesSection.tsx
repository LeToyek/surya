// src/components/RecentActivitiesSection.tsx
'use client';
import React from 'react';
import { Heart } from 'lucide-react';
import { RecentActivity } from '../types'; // Adjust path

interface RecentActivitiesSectionProps {
  activities: RecentActivity[];
}

const RecentActivitiesSection: React.FC<RecentActivitiesSectionProps> = ({ activities }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          <p className="text-gray-600">See the latest donations from our amazing community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {activity.donor} donated ${activity.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">to {activity.school}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivitiesSection;