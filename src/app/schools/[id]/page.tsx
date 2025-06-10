// src/app/schools/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { School, SchoolDonor } from '../../../types'; // Add PanelGridConfig
import { schoolsData, schoolDonorsData } from '../../../data/schoolData';
import DonorList from '../../../components/DonorList';
import SchoolDonationDetails from '../../../components/SchoolDonationDetails';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import SolarPanelGridSection from '../../../components/SolarPanelGridSection';

const SchoolDetailPage = () => {
  const params = useParams();
  const [school, setSchool] = useState<School | undefined>(undefined);
  const [donors, setDonors] = useState<SchoolDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

  // ... (useEffect for fetching school and donors remains the same)
   useEffect(() => {
    if (params?.id) {
      setIsLoading(true);
      const idString = params.id as string;
      const currentSchoolId = parseInt(idString, 10);

      if (isNaN(currentSchoolId)) {
        setErrorOccurred(true); setIsLoading(false); return;
      }
      const foundSchool = schoolsData.find(s => s.id === currentSchoolId);
      if (foundSchool) {
        setSchool(foundSchool);
        const schoolSpecificDonors = schoolDonorsData.filter(d => d.schoolId === currentSchoolId);
        setDonors(schoolSpecificDonors);
        setErrorOccurred(false);
      } else {
        setErrorOccurred(true);
      }
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (errorOccurred && !isLoading) { notFound(); }
  }, [errorOccurred, isLoading]);


  if (isLoading) { /* ... loading JSX ... */
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <p className="text-xl text-gray-600">Loading school details...</p>
        </div>
        <Footer />
      </>
    );
  }
  if (!school) { /* ... notFound() should be called by effect ... */
     notFound(); // Fallback
     return null;
  }

  // panelGridConfigs will be taken from school object.
  // The SolarPanelGridSection has its own fallback if school.panelGridConfigs is undefined.
  const panelConfigs = school.panelGridConfigs;

  return (
    <>
      <Navbar />
      <main className="
      max-w-screen-2xl
      mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-100 min-h-screen">
        {/* ... (Back link, School Details header, DonorList, SchoolDonationDetails - same as before) ... */}
         <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors group">
            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to All Schools
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          School Details: <span className="text-sky-700">{school.name}</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <div className="lg:col-span-1">
            <DonorList donors={donors} schoolName={school.name} />
          </div>
          <div className="lg:col-span-2">
            <SchoolDonationDetails school={school} />
          </div>
        </div>

        <SolarPanelGridSection
          schoolId={school.id}
          panelGridConfigs={panelConfigs} // Pass the array of grid configurations
          // initialPanelsData={/* pass if you have pre-existing panel data for this school */}
        />
      </main>
      <Footer />
    </>
  );
};

export default SchoolDetailPage;