// First install: npm install @headlessui/react framer-motion
// src/components/DonationModal.tsx
'use client';
import React, { useState, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Gift, User, DollarSign, Smile } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donorName: string, donationAmount: number, logo: string) => void;
  selectedPanelCount: number;
}

const DonationModal: React.FC<DonationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedPanelCount 
}) => {
  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [logo, setLogo] = useState('☀️');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(donationAmount);
    if (!donorName.trim() || isNaN(amount) || amount <= 0) {
      alert('Please fill in all fields correctly. Donation amount must be a positive number.');
      return;
    }
    onSubmit(donorName, amount, logo);
    // Reset form
    setDonorName('');
    setDonationAmount('');
    setLogo('☀️');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal positioning */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 md:p-8 text-left align-middle shadow-2xl transition-all">
                {/* Header */}
                <motion.div 
                  className="flex justify-between items-center mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Dialog.Title className="text-2xl font-semibold text-sky-700 flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Gift className="mr-3 text-yellow-500" size={28} />
                    </motion.div>
                    Donate for Panel(s)
                  </Dialog.Title>
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
                    aria-label="Close donation modal"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </motion.div>

                {/* Description */}
                <motion.p 
                  className="mb-6 text-gray-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  You are donating for{' '}
                  <motion.strong 
                    className="text-sky-600"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {selectedPanelCount}
                  </motion.strong>{' '}
                  solar panel(s). Thank you for your generous support!
                </motion.p>

                {/* Form */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Donor Name Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="donorName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name / Organization
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="donorName"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all duration-200"
                        placeholder="e.g., John Doe or Acme Corp"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Donation Amount Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Donation Amount (Total)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="number"
                        id="donationAmount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all duration-200"
                        placeholder="e.g., 50"
                        min="1"
                        step="any"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Logo Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Representation (Emoji or Character)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Smile className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="logo"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        maxLength={5}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all duration-200"
                        placeholder="e.g., ❤️, 🚀, ACME"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">A single emoji or a few characters work best.</p>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div 
                    className="pt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Complete Donation
                    </motion.button>
                  </motion.div>
                </motion.form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DonationModal;