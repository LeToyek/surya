// src/components/SchoolListSection.tsx
'use client';
import React, { useState } from 'react';
import SchoolCard from './SchoolCard'; // Adjust path
import { School, AnimatedValues, IsVisibleState } from '../types'; // Adjust path

interface SchoolListSectionProps {
  schools: School[];
  animatedValues: AnimatedValues;
  isVisible: IsVisibleState;
}

const SchoolListSection: React.FC<SchoolListSectionProps> = ({ schools, animatedValues, isVisible }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { key: 'all', label: 'All Schools' },
    { key: 'elementary', label: 'Elementary' },
    { key: 'middle', label: 'Middle School' },
    { key: 'high', label: 'High School' },
  ];

  const filteredSchools = schools.filter(school =>
    activeFilter === 'all' || school.category === activeFilter
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Schools Seeking Support</h2>
          <p className="text-gray-600 mb-8">Help these schools achieve energy independence through solar power</p>

          <div className="flex justify-center space-x-2 sm:space-x-4 mb-8 flex-wrap gap-2">
            {filterOptions.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 sm:px-6 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${
                  activeFilter === filter.key
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map(school => (
            <SchoolCard
              key={school.id}
              school={school}
              isVisible={isVisible[`school-${school.id}`] || false}
              animatedFundedAmount={animatedValues[school.id] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolListSection;