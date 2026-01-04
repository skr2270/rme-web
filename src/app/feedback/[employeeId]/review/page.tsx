'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const employeeId = params.employeeId as string;
  const rating = searchParams.get('rating');

  const [currentStep, setCurrentStep] = useState<'review' | 'userInfo' | 'otp'>('review');
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const handleSubmitReview = () => {
    if (review.trim()) {
      setCurrentStep('userInfo');
    }
  };

  const handleContinueUserInfo = () => {
    if (name.trim() && phone.trim()) {
      setCurrentStep('otp');
    }
  };

  const handleSubmitOtp = () => {
    router.push('/feedback/thank-you');
  };

  const handleBack = () => {
    if (currentStep === 'userInfo') {
      setCurrentStep('review');
    } else if (currentStep === 'otp') {
      setCurrentStep('userInfo');
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

        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[
                { step: 'review', label: 'Review', completed: currentStep !== 'review' },
                { step: 'userInfo', label: 'Details', completed: currentStep === 'otp' },
                { step: 'otp', label: 'Verify', completed: false }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    item.completed 
                      ? 'bg-violet-600 text-white' 
                      : currentStep === item.step 
                        ? 'bg-violet-100 text-violet-600 border-2 border-violet-600' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {item.completed ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === item.step ? 'text-violet-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      item.completed ? 'bg-violet-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          {(currentStep === 'userInfo' || currentStep === 'otp') && (
            <button 
              onClick={handleBack}
              className="mb-6 text-violet-600 hover:text-violet-700 font-semibold text-sm flex items-center gap-2 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {/* Step 1: Review Form */}
          {currentStep === 'review' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-4 shadow-sm">
                  SHARE YOUR FEEDBACK
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Tell us about your experience
                </h2>
                <p className="text-sm text-gray-600">
                  Your detailed feedback helps us improve our service quality
                </p>
                {rating && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-lg">
                    <span className="text-violet-600 font-semibold">Your Rating:</span>
                    <div className="flex">
                      {Array(5).fill('').map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(parseInt(rating) / 2) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-violet-600 font-bold">{rating}/10</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience, what went well, and how we can improve..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base placeholder-gray-500 resize-none"
                    rows={5}
                    aria-label="Review input"
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={!review.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  Continue to Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: User Info Form */}
          {currentStep === 'userInfo' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200/50 text-violet-700 font-semibold text-xs mb-4 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  <span>Your feedback matters!</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Almost there!
                </h2>
                <p className="text-sm text-gray-600">
                  Please provide your details to complete the feedback
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900 text-base placeholder-gray-500"
                  />
                </div>
                
                <Button
                  onClick={handleContinueUserInfo}
                  disabled={!name.trim() || !phone.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  Continue to Verification
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {currentStep === 'otp' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-4 shadow-sm">
                  OTP VERIFICATION
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Verify your phone number
                </h2>
                <p className="text-sm text-gray-600">
                  OTP has been sent to +91 {phone}
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {Array(6).fill('').map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('');
                        newOtp[index] = e.target.value;
                        setOtp(newOtp.join(''));
                      }}
                      className="w-10 h-10 text-center bg-gray-50 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-gray-900 text-lg font-bold"
                    />
                  ))}
                </div>
                
                <Button
                  onClick={handleSubmitOtp}
                  disabled={otp.length !== 6}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  Verify & Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}