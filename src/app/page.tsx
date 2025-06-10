// src/app/page.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SchoolListSection from '../components/SchoolListSection';
import RecentActivitiesSection from '../components/RecentActivitiesSection';
import MapSection from '../components/MapSection';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';
import { AnimatedValues, IsVisibleState } from '../types';
import { easeOutCubic } from '../utils/mathUtils';
import { schoolsData as allSchools, recentActivitiesData as allRecentActivities } from '../data/schoolData';

export default function HomePage() { // Changed to HomePage for clarity or keep as default export
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({});
  const [isVisible, setIsVisible] = useState<IsVisibleState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // animateValue and useEffects remain the same as in your original SolarSchoolsLanding
    const animateValue = useCallback((id: number, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * easeOutCubic(progress);

      setAnimatedValues(prev => ({
        ...prev,
        [id]: Math.floor(current)
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, { threshold: 0.1 });

    const timer = setTimeout(() => {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => observerRef.current?.observe(el));
    }, 0);


    return () => {
        observerRef.current?.disconnect();
        clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    allSchools.forEach(school => {
      if (isVisible[`school-${school.id}`] && animatedValues[school.id] === undefined) {
        animateValue(school.id, 0, school.funded, 2000);
      }
    });
  }, [isVisible, animatedValues, animateValue]);


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SchoolListSection
        schools={allSchools}
        animatedValues={animatedValues}
        isVisible={isVisible}
      />
      <RecentActivitiesSection activities={allRecentActivities} />
      <MapSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};