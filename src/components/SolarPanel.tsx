// src/components/SolarPanel.tsx
'use client';
import React from 'react';
import { SolarPanelType } from '../types';
import { CheckCircle, Sun } from 'lucide-react';

interface SolarPanelProps {
  panel: SolarPanelType;
  onPanelClick: (id: string) => void;
}

const SolarPanel: React.FC<SolarPanelProps> = ({ panel, onPanelClick }) => {
  const baseStyle = "aspect-square border flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer";
  const selectedStyle = panel.isSelected ? "ring-4 ring-offset-1 ring-sky-500 scale-105 shadow-xl z-10" : "hover:scale-105 hover:shadow-lg";
  const donatedStyle = panel.isDonated ? "bg-green-100 border-green-300" : "bg-gray-200 border-gray-300 hover:bg-gray-300";
  const donatedSelectedStyle = panel.isDonated && panel.isSelected ? "ring-green-600" : "";

  return (
    <div
      onClick={() => onPanelClick(panel.id)}
      className={`${baseStyle} ${donatedStyle} ${selectedStyle} ${donatedSelectedStyle} relative group`}
      title={
        panel.isDonated
          ? `Donated by: ${panel.donorName || 'Anonymous'}\nAmount: $${panel.donationAmount || 'N/A'}`
          : `Available Panel (ID: ${panel.id})`
      }
    >
      {panel.isDonated ? (
        <div className="text-center p-1 overflow-hidden">
          {panel.logo ? (
            <span className="text-2xl md:text-3xl lg:text-4xl break-all" role="img" aria-label={panel.donorName || 'logo'}>
              {panel.logo}
            </span>
          ) : (
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          )}
          <p className="text-xs text-green-700 font-semibold truncate absolute bottom-0 left-0 right-0 bg-white/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {panel.donorName}
          </p>
        </div>
      ) : (
        <Sun className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-yellow-500 transition-colors" />
      )}
       {panel.isSelected && !panel.isDonated && (
         <div className="absolute inset-0 bg-sky-500 bg-opacity-30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
         </div>
       )}
    </div>
  );
};

export default SolarPanel;