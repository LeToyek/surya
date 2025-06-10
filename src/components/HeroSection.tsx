// src/components/HeroSection.tsx
'use client';
import React from 'react';
import { Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-16 bg-gradient-to-br from-sky-50 via-white to-blue-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Power Schools with{' '}
                <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                  Solar Energy
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our mission to bring sustainable energy to schools across the nation.
                Every donation helps install solar panels and creates a brighter future for students.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Donating
              </button>
              <button className="px-8 py-4 border-2 border-sky-500 text-sky-600 rounded-full font-semibold hover:bg-sky-50 transition-all duration-200">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">150+</div>
                <div className="text-gray-600">Schools Funded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">$2.5M</div>
                <div className="text-gray-600">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">50K+</div>
                <div className="text-gray-600">Students Impacted</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-sky-100 to-blue-100 aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-600/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group">
                  <Play className="w-8 h-8 text-sky-600 ml-1 group-hover:text-sky-700" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800">
                  See How Solar Powers Education
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Watch success stories from funded schools
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;