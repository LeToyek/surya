// src/components/DonorList.tsx
'use client';
import React from 'react';
import { SchoolDonor } from '../types'; // Adjust path as needed
import { Gift, UserCircle2 } from 'lucide-react';

interface DonorListProps {
  donors: SchoolDonor[];
  schoolName: string;
}

const DonorList: React.FC<DonorListProps> = ({ donors, schoolName }) => {
  if (!donors || donors.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg h-full">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Donors for {schoolName}
        </h3>
        <p className="text-gray-600">No donations recorded for this school yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl h-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Our Valued Donors <span className="text-sky-600">for {schoolName}</span>
      </h3>
      <div className="space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {donors.map((donor) => (
          <div key={donor.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-sky-600 text-2xl">
                {donor.avatar ? (
                  <span title={donor.donorName}>{donor.avatar}</span>
                ) : (
                  <UserCircle2 size={28} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-sky-700 truncate" title={donor.donorName}>
                  {donor.donorName}
                </p>
                <p className="text-sm text-gray-500">
                  Donated: <span className="font-medium text-green-600">${donor.amount.toLocaleString()}</span>
                </p>
                <p className="text-xs text-gray-400">{donor.date}</p>
              </div>
              <Gift size={24} className="text-yellow-500 flex-shrink-0" />
            </div>
            {donor.message && (
              <p className="mt-2 text-sm text-gray-700 italic bg-sky-50 p-2 rounded-md border-l-4 border-sky-300">
                {`"${donor.message}"`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorList;