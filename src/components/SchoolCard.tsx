// src/components/SchoolCard.tsx
'use client';
import React from 'react';
import { MapPin } from 'lucide-react';
import { School } from '../types'; // Adjust path if needed
import Link from 'next/link'; // Import Link

interface SchoolCardProps {
  school: School;
  isVisible: boolean;
  animatedFundedAmount: number;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, isVisible, animatedFundedAmount }) => {
  return (
    <Link 
      href={`/schools/${school.id}`}
      className={`block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id={`school-${school.id}`}
      data-animate
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{school.logo}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
              {school.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {school.address}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-sky-600">{school.percentage}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? `${school.percentage}%` : '0%',
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${animatedFundedAmount?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-500">of ${school.goal.toLocaleString()} goal</div>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation
                e.stopPropagation(); // Prevent event bubbling
                console.log("Donate button clicked for:", school.name);
                // Add your donate logic here
              }}
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SchoolCard;