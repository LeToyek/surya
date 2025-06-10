// src/components/SchoolDonationDetails.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { School } from '../types'; // Adjust path as needed
import { Target, TrendingUp, DollarSign, Zap, CheckCircle } from 'lucide-react';
import { easeOutCubic } from '../utils/mathUtils'; // Assuming you have this

interface SchoolDonationDetailsProps {
  school: School;
}

const SchoolDonationDetails: React.FC<SchoolDonationDetailsProps> = ({ school }) => {
  const [animatedFunded, setAnimatedFunded] = useState(0);

  useEffect(() => {
    // Animate the funded amount when the component mounts or school.funded changes
    const animateValue = (start: number, end: number, duration: number) => {
      const startTime = performance.now();
      const animationFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * easeOutCubic(progress);
        setAnimatedFunded(Math.floor(current));
        if (progress < 1) {
          requestAnimationFrame(animationFrame);
        }
      };
      requestAnimationFrame(animationFrame);
    };

    animateValue(0, school.funded, 1500); // Animate over 1.5 seconds
  }, [school.funded]);

  const percentageFunded = school.goal > 0 ? (school.funded / school.goal) * 100 : 0;
  const amountNeeded = school.goal - school.funded;

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl h-full">
      <div className="flex items-start space-x-4 mb-6 pb-4 border-b">
        <span className="text-6xl">{school.logo}</span>
        <div>
          <h2 className="text-3xl font-bold text-sky-700">{school.name}</h2>
          <p className="text-gray-600">{school.address}</p>
        </div>
      </div>

      {school.description && (
        <div className="mb-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
          <h4 className="font-semibold text-sky-800 mb-1">About this Project:</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{school.description}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Progress</span>
            <span className="text-sky-600">{percentageFunded.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${percentageFunded}%` }}
            >
              {percentageFunded > 10 && `${percentageFunded.toFixed(0)}%`}
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center text-green-700 mb-1">
              <DollarSign size={20} className="mr-2" />
              <h4 className="font-semibold">Amount Raised</h4>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${animatedFunded.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
            <div className="flex items-center text-yellow-700 mb-1">
              <Target size={20} className="mr-2" />
              <h4 className="font-semibold">Funding Goal</h4>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              ${school.goal.toLocaleString()}
            </p>
          </div>
        </div>

        {amountNeeded > 0 ? (
           <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <div className="flex items-center justify-center text-orange-700 mb-1">
                <TrendingUp size={20} className="mr-2" />
                <h4 className="font-semibold">Still Needed to Reach Goal</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600">
                ${amountNeeded.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-teal-50 rounded-lg border border-teal-300 text-center flex items-center justify-center space-x-2">
            <CheckCircle size={28} className="text-teal-600" />
            <p className="text-xl font-semibold text-teal-700">
              Congratulations! Funding Goal Reached!
            </p>
          </div>
        )}


        {/* Call to Action */}
        <div className="mt-8 text-center">
          <button className="w-full px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
            <Zap size={20} className="inline mr-2" /> Donate to {school.name}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Every contribution brings {school.name} closer to a sustainable future!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolDonationDetails;