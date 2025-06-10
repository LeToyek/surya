// src/components/CallToActionSection.tsx
'use client';
import React from 'react';

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-sky-500 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8 text-sky-100">
          Join thousands of donors helping schools transition to clean, renewable energy
        </p>
        <button className="px-8 py-4 bg-white text-sky-600 rounded-full font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
          Start Your Impact Today
        </button>
      </div>
    </section>
  );
};

export default CallToActionSection;