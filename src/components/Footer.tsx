// src/components/Footer.tsx
'use client';
import React from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">SolarSchools</span>
            </div>
            <p className="text-gray-400">
              Empowering education through sustainable energy solutions.
            </p>
          </div>

          {['About', 'Schools', 'Donors', 'Contact'].map(section => (
            <div key={section}>
              <h3 className="font-semibold mb-4">{section}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Our Mission</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-sky-400 transition-colors">Get Started</Link></li>
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SolarSchools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;