'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { RatingStars } from '@/components/molecules/RatingStars';
import { dummyEmployeeList } from '@/app/data/dummyEmployees';

export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  const employee = dummyEmployeeList.find(emp => emp.id === employeeId);

  const [rating, setRating] = useState<number | null>(null);

  if (!employee) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee not found</h1>
          <Button onClick={() => router.push('/feedback')} className="bg-violet-600 text-white px-6 py-3 rounded-xl">
            Back to Feedback
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (rating) {
      router.push(`/feedback/${employeeId}/review?rating=${rating}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-stone-100/40 via-stone-100/30 to-stone-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-gradient-to-tr from-slate-100/40 via-gray-100/30 to-slate-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="mb-6 text-violet-600 hover:text-violet-700 font-semibold text-sm flex items-center gap-2 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Employees
          </button>

          {/* Rating Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              {/* Employee Photo */}
              <div className="relative mb-6">
                <Image
                  src={employee.imageUrl}
                  alt={employee.name}
                  width={120}
                  height={120}
                  className="rounded-xl mx-auto w-24 h-24 sm:w-28 sm:h-28 object-cover"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  <span className="text-violet-600 text-sm">⭐</span>
                </div>
              </div>

              {/* Employee Info */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{employee.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-8">{employee.jobTitle}</p>

              {/* Rating Section */}
              <div className="mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-4 shadow-sm">
                  RATE EXPERIENCE
                </div>
                <p className="text-sm text-gray-600 mb-6">How was your experience with {employee.name}?</p>
                <RatingStars maxRating={10} onRatingSelect={setRating} />
                {rating && (
                  <p className="text-sm text-violet-600 font-semibold mt-3">
                    You rated: {rating}/10
                  </p>
                )}
              </div>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                disabled={!rating}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
