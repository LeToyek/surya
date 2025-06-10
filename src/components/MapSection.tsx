// src/components/MapSection.tsx
'use client';
import React from 'react';
import { MapPin } from 'lucide-react';

const MapSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Schools Across the Nation</h2>
          <p className="text-gray-600">Find participating schools in your area</p>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 text-center">
          <div className="w-full h-64 bg-white rounded-xl shadow-inner flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="w-12 h-12 text-sky-400 mx-auto" />
              <div className="text-gray-600">Interactive Map Coming Soon</div>
              <div className="text-sm text-gray-500">Explore schools by location and funding status</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;