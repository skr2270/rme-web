'use client';

import Link from 'next/link';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';

export default function ThankYouPage() {
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
          {/* Success Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all text-center">
            {/* Success Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200/50 text-green-700 font-semibold text-sm mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Feedback submitted successfully!</span>
            </div>

            {/* Success Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⭐</span>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Thank you for your feedback!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
              Your insights help us improve our service quality and create better experiences for everyone.
            </p>

            {/* Rating Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl text-yellow-400">★</span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = '/feedback'}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
              >
                Rate Another Employee
              </Button>
              
              <Link href="/">
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold text-base transition-all hover:scale-105">
                  Back to Homepage
                </Button>
              </Link>
            </div>

            {/* App Download CTA */}
            <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl border border-violet-200">
              <p className="text-xs text-violet-700 font-semibold mb-2">
                Want to rate anonymously?
              </p>
              <p className="text-xs text-violet-600">
                Download our mobile app for a completely anonymous rating experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}