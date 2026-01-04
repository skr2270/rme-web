'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { CategoryFilter } from '@/components/molecules/CategoryFilter';
import { EmployeeList } from '@/components/organisms/EmployeeList';
import { Button } from '@/components/atoms/Button';
import { dummyEmployeeList } from '@/app/data/dummyEmployees';

const categories = ["Managers", "Staff", "Executives", "Cooks", "Cashier"];

export default function FeedbackPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleRateClick = (id: string) => {
    router.push(`/feedback/${id}/rate`);
  };

  const employees = selectedCategory
    ? dummyEmployeeList.filter(emp => emp.jobTitle === selectedCategory)
    : dummyEmployeeList;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-stone-100/40 via-stone-100/30 to-stone-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-gradient-to-tr from-slate-100/40 via-gray-100/30 to-slate-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200/50 text-violet-700 font-semibold text-sm mb-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span>Real-time feedback system</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-[1.1] tracking-tight">
              <span className="block">Rate Your</span>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-600 bg-clip-text text-transparent animate-gradient">
                  Service Experience
                </span>
                <svg className="absolute -bottom-1 left-0 w-full hidden sm:block" height="8" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C50 3 100 1 150 2C200 3 250 5 298 6" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9333ea"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Help improve service quality by rating your experience with our team members
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-4 shadow-sm">
              FILTER BY ROLE
            </div>
            <CategoryFilter categories={categories} onCategorySelect={setSelectedCategory} />
          </div>

          {/* Employee List */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all mb-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Select an Employee to Rate</h2>
              <p className="text-sm text-gray-600">Choose the team member you interacted with</p>
            </div>
            <EmployeeList employees={employees} onRateClick={handleRateClick} />
          </div>

          {/* Overall Service Rating */}
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl p-6 sm:p-8 text-white shadow-2xl shadow-violet-500/30">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Rate Overall Service</h3>
              <p className="text-violet-100 mb-6 text-sm sm:text-base">
                Share your overall experience and help us improve our service quality
              </p>
              <Button 
                className="w-full sm:w-auto bg-white text-violet-600 hover:bg-gray-100 py-3 px-8 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => router.push('/feedback/overall/rate')}
              >
                Rate Overall Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
