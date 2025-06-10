// src/components/SolarPanelGridSection.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { SolarPanelType, PanelGridConfig } from '../types'; // Import PanelGridConfig
import SolarPanel from './SolarPanel';
import DonationModal from './DonationModal';
import { Zap, Grid as GridIcon, Layers } from 'lucide-react'; // Changed Grid to GridIcon to avoid name clash

interface SolarPanelGridSectionProps {
  schoolId: number;
  panelGridConfigs?: PanelGridConfig[]; // Expect an array of grid configurations
  initialPanelsData?: SolarPanelType[]; // Optional: For pre-filled or loaded panel states
}

// Fallback if no configs are provided (though parent should provide them)
const FALLBACK_CONFIG: PanelGridConfig[] = [
  { gridId: "default_grid", gridTitle: "Solar Array", rows: 5, cols: 8 }
];

const SolarPanelGridSection: React.FC<SolarPanelGridSectionProps> = ({
  schoolId,
  panelGridConfigs,
  initialPanelsData,
}) => {
  const [panels, setPanels] = useState<SolarPanelType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const activePanelGridConfigs = panelGridConfigs && panelGridConfigs.length > 0
    ? panelGridConfigs
    : FALLBACK_CONFIG;

  // Initialize panels
  useEffect(() => {
    console.log(`SolarPanelGridSection: Initializing panels for schoolId ${schoolId} using ${activePanelGridConfigs.length} grid configs.`);
    if (initialPanelsData && initialPanelsData.length > 0) {
      // If specific panel data is provided (e.g., from a backend), use it.
      // Ensure it has isSelected or set a default.
      setPanels(initialPanelsData.map(p => ({ ...p, isSelected: p.isSelected || false })));
    } else {
      // Generate panels based on the configurations
      const newPanels: SolarPanelType[] = [];
      activePanelGridConfigs.forEach(config => {
        for (let r = 0; r < config.rows; r++) {
          for (let c = 0; c < config.cols; c++) {
            newPanels.push({
              id: `s${schoolId}-g${config.gridId}-r${r}c${c}`, // Unique ID incorporating school, grid, row, col
              gridId: config.gridId,
              row: r,
              col: c,
              isDonated: false,
              isSelected: false,
            });
          }
        }
      });
      setPanels(newPanels);
    }
  }, [activePanelGridConfigs, initialPanelsData, schoolId]); // Re-initialize if configs or schoolId change

  // ... (useEffect for Ctrl key remains the same) ...
   useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') setIsCtrlPressed(true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Control') setIsCtrlPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  const handlePanelClick = useCallback(/* ... same as before ... */ (panelId: string) => {
    setPanels(prevPanels =>
      prevPanels.map(p => {
        if (p.id === panelId) {
          if (p.isDonated) return p;
          return { ...p, isSelected: isCtrlPressed ? !p.isSelected : true };
        }
        // If not holding Ctrl, deselect panels from *other* grid sections as well,
        // unless you want selection to be independent per grid.
        // Current logic: Ctrl allows additive selection globally; click without Ctrl selects one globally.
        return isCtrlPressed ? p : { ...p, isSelected: false };
      })
    );
  }, [isCtrlPressed]);

  const selectedPanels = panels.filter(p => p.isSelected && !p.isDonated);
  const selectedPanelCount = selectedPanels.length;

  const handleOpenModal = () => { /* ... same as before ... */
     if (selectedPanelCount > 0) {
      setIsModalOpen(true);
    } else {
      alert("Please select at least one available panel to donate.");
    }
  };

  const handleDonationSubmit = (donorName: string, donationAmount: number, logo: string) => {
     /* ... same as before, updates the flat panels array ... */
    setPanels(prevPanels =>
      prevPanels.map(p => {
        if (p.isSelected && !p.isDonated) {
          return {
            ...p,
            isDonated: true,
            donorName,
            donationAmount: selectedPanelCount > 0 ? parseFloat((donationAmount / selectedPanelCount).toFixed(2)) : donationAmount,
            logo,
            isSelected: false,
          };
        }
        return p;
      })
    );
    setIsModalOpen(false);
  };

  const clearSelection = () => { /* ... same as before ... */
     setPanels(prevPanels => prevPanels.map(p => ({ ...p, isSelected: false })));
  };

  return (
    <section className="py-10 md:py-16 bg-sky-50 rounded-lg shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4"> {/* Increased max-width for potentially wider layouts */}
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-sky-800 mb-3 flex items-center justify-center">
            <Layers size={36} className="mr-3 text-yellow-500" /> {/* Changed icon */}
            Sponsor Solar Panels!
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This school features multiple panel arrays. Click to select. Hold <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md">Ctrl</kbd> for multi-select.
          </p>
        </div>

        {/* Iterate over each grid configuration to render multiple grids */}
        <div className="space-y-10 md:space-y-16">
          {activePanelGridConfigs.map(config => {
            const panelsForThisGrid = panels.filter(p => p.gridId === config.gridId);
            return (
              <div key={config.gridId} className="p-4 bg-white rounded-xl shadow-lg">
                {config.gridTitle && (
                  <h4 className="text-xl font-semibold text-sky-700 mb-4 pb-2 border-b border-sky-200 flex items-center">
                    <GridIcon size={22} className="mr-2 text-sky-500" />
                    {config.gridTitle}
                     <span className="ml-auto text-sm font-normal text-gray-500">({config.rows} x {config.cols} = {config.rows * config.cols} panels)</span>
                  </h4>
                )}
                <div
                  className="grid gap-1.5 md:gap-2 p-2 md:p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-md"
                  style={{
                    gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                    // Max width for each individual grid can be set here if needed
                    // maxWidth: `${config.cols * 3.5}rem`,
                    // Or let them take available width within their container
                  }}
                >
                  {panelsForThisGrid.map(panel => (
                    <SolarPanel key={panel.id} panel={panel} onPanelClick={handlePanelClick} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ... (Conditional rendering for donate button and messages remains the same) ... */}
        {selectedPanelCount > 0 && (
          <div className="mt-10 text-center space-y-3 md:space-y-0 md:space-x-4 animate-modalPopIn">
            <p className="text-md text-sky-700 font-medium">
              {selectedPanelCount} panel(s) selected across all arrays.
              <button onClick={clearSelection} className="ml-3 text-xs text-red-500 hover:underline">(Clear Selection)</button>
            </p>
            <button
              onClick={handleOpenModal}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
            >
              <Zap size={20} className="inline mr-2" />
              Donate for Selected ({selectedPanelCount})
            </button>
          </div>
        )}
         {selectedPanelCount === 0 && panels.length > 0 && (
            <p className="mt-10 text-center text-gray-500">
                Click on any gray panel above to make your mark!
            </p>
        )}
         {panels.length === 0 && (
            <p className="mt-10 text-center text-gray-500">
                Loading panel grids...
            </p>
        )}
      </div>
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDonationSubmit}
        selectedPanelCount={selectedPanelCount}
      />
    </section>
  );
};

export default SolarPanelGridSection;