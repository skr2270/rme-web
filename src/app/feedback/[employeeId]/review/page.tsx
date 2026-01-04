'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { graphqlRequest, normalizeIndianPhone } from '@/lib/graphql';

type PublicEmployeeProfile = {
  id: string;
  ueid?: string | null;
  name: string;
  designation?: string | null;
  photoUrl?: string | null;
  business_id?: string | null;
  location_id?: string | null;
};

type PublicBusinessProfile = {
  business_id: string;
  displayName?: string | null;
  category?: number | null;
};

type FeedbackTextRow = {
  categoryId: number;
  question: number;
  text: string;
};

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const employeeId = params.employeeId as string;
  const rating = Number(searchParams.get('rating') || '0');
  const businessIdFromRoute = searchParams.get('business_id');

  const [currentStep, setCurrentStep] = useState<'review' | 'userInfo' | 'otp'>('review');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<PublicEmployeeProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<PublicBusinessProfile | null>(null);
  const [questions, setQuestions] = useState<Array<{ question: number; text: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const businessId = businessIdFromRoute || employee?.business_id || null;
  const categoryId = businessProfile?.category ?? null;

  const canContinueFromFeedback = useMemo(() => {
    if (!rating || rating < 1 || rating > 10) return false;
    if (!questions.length) return true;
    // Expect answers for the questions we show.
    return questions.every((q) => (answers[q.question] || 0) > 0);
  }, [answers, questions, rating]);

  const handleSubmitReview = () => {
    if (canContinueFromFeedback) {
      setError(null);
      setCurrentStep('userInfo');
    }
  };

  const handleContinueUserInfo = async () => {
    const customerName = name.trim();
    const customerPhone = normalizeIndianPhone(phone);
    if (!customerName || !customerPhone) return;

    setSubmitting(true);
    setError(null);
    try {
      const q1Rating = answers[1] || null;
      const q2Rating = answers[2] || null;
      const q3Rating = answers[3] || null;
      const q4Rating = answers[4] || null;

      const data = await graphqlRequest<{
        createPublicReview: {
          success: boolean;
          reviewId?: string | null;
          message?: string | null;
          errorMessage?: string | null;
          requiresOtpVerification?: boolean | null;
        };
      }>(
        `mutation CreatePublicReview($input: PublicCreateReviewInput!) {
          createPublicReview(input: $input) {
            success
            reviewId
            message
            errorMessage
            requiresOtpVerification
          }
        }`,
        {
          input: {
            employeeId,
            business_id: businessId,
            rating,
            q1Rating,
            q2Rating,
            q3Rating,
            q4Rating,
            comment: comment.trim() || null,
            customerName,
            customerPhone,
            sendOtp: true,
          },
        },
        'CreatePublicReview',
      );

      const res = data.createPublicReview;
      if (!res?.success) {
        throw new Error(res?.errorMessage || 'Unable to submit review.');
      }

      if (res.requiresOtpVerification) {
        if (!res.reviewId) {
          throw new Error('Review submission succeeded but reviewId is missing.');
        }
        setReviewId(res.reviewId);
        setCurrentStep('otp');
      } else {
        router.push('/feedback/thank-you');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (!reviewId) return;
    if ((otp || '').trim().length !== 6) return;

    setVerifying(true);
    setError(null);
    try {
      const data = await graphqlRequest<{
        verifyReviewOtp: {
          success: boolean;
          token?: string | null;
          message?: string | null;
          errorMessage?: string | null;
        };
      }>(
        `mutation VerifyReviewOtp($input: VerifyReviewOtpInput!) {
          verifyReviewOtp(input: $input) {
            success
            token
            message
            errorMessage
          }
        }`,
        { input: { reviewId, otp: otp.trim() } },
        'VerifyReviewOtp',
      );

      if (!data.verifyReviewOtp?.success) {
        throw new Error(data.verifyReviewOtp?.errorMessage || 'OTP verification failed.');
      }

      router.push('/feedback/thank-you');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OTP verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await graphqlRequest<{ publicEmployee: PublicEmployeeProfile }>(
          `query PublicEmployee($employeeId: String!) {
            publicEmployee(employeeId: $employeeId) {
              id
              ueid
              name
              designation
              photoUrl
              business_id
              location_id
            }
          }`,
          { employeeId },
          'PublicEmployee',
        );
        if (!active) return;
        setEmployee(data.publicEmployee);
      } catch {
        if (!active) return;
        setEmployee(null);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [employeeId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!businessId) {
        setBusinessProfile(null);
        return;
      }
      try {
        const data = await graphqlRequest<{ publicBusinessProfile: PublicBusinessProfile }>(
          `query PublicBusinessProfile($businessId: String!) {
            publicBusinessProfile(businessId: $businessId) {
              business_id
              displayName
              category
            }
          }`,
          { businessId },
          'PublicBusinessProfile',
        );
        if (!active) return;
        setBusinessProfile(data.publicBusinessProfile);
      } catch {
        if (!active) return;
        setBusinessProfile(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [businessId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!categoryId) {
        setQuestions([]);
        return;
      }

      try {
        const data = await graphqlRequest<{ feedbackTextsByCategory: FeedbackTextRow[] }>(
          `query FeedbackTextsByCategory($categoryId: Int!) {
            feedbackTextsByCategory(categoryId: $categoryId) {
              categoryId
              question
              text
            }
          }`,
          { categoryId },
          'FeedbackTextsByCategory',
        );
        if (!active) return;
        const list = (data.feedbackTextsByCategory || [])
          .slice()
          .sort((a, b) => a.question - b.question)
          .map((r) => ({ question: r.question, text: r.text }));
        setQuestions(list);
      } catch {
        if (!active) return;
        setQuestions([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [categoryId]);

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

          {/* Step 1: Feedback */}
          {currentStep === 'review' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-violet-700 text-xs font-bold mb-4 shadow-sm">
                  SHARE YOUR FEEDBACK
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Edit Feedback
                </h2>
                <p className="text-sm text-gray-600">
                  Your feedback goes directly to the owner.
                </p>
              </div>

              {loading ? (
                <div className="text-sm text-gray-600 text-center mb-6">Loading…</div>
              ) : !employee ? (
                <div className="text-sm text-gray-600 text-center mb-6">Employee not found.</div>
              ) : null}

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-extrabold text-gray-900 leading-tight">
                      {businessProfile?.displayName || 'Rate My Employee'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">General Feedback</div>
                    <div className="text-sm text-gray-500 mt-4 whitespace-pre-line">
                      {(businessProfile?.displayName || '').trim()}
                      {(businessProfile?.displayName || '').trim() ? `\n/${(businessProfile?.displayName || '').trim()}` : ''}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700">{rating}/10</div>
                </div>
                <div className="h-px bg-gray-200" />

                <div className="p-4 space-y-6">
                  {questions.map((q) => {
                    const value = answers[q.question] || 0;
                    return (
                      <div key={q.question}>
                        <div className="text-sm font-medium text-gray-900 mb-3">
                          {q.question}. {q.text}
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const starValue = idx + 1;
                            const active = starValue <= value;
                            return (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setAnswers((prev) => ({ ...prev, [q.question]: starValue }))}
                                className={
                                  active
                                    ? 'text-yellow-400 text-2xl leading-none'
                                    : 'text-gray-300 text-2xl leading-none'
                                }
                                aria-label={`Question ${q.question} rating ${starValue} of 5`}
                              >
                                ★
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Comments</div>
                    <div className="rounded-2xl bg-gray-100 p-3">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your feedback here..."
                        className="w-full bg-gray-100 outline-none resize-none text-gray-900 text-base placeholder-gray-500"
                        rows={4}
                        aria-label="Comments"
                      />
                    </div>
                  </div>

                  {error ? <div className="text-sm text-red-600">{error}</div> : null}

                  <Button
                    onClick={handleSubmitReview}
                    disabled={!canContinueFromFeedback}
                    className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                </div>
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
                  disabled={!name.trim() || !phone.trim() || submitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {submitting ? 'Submitting…' : 'Continue to Verification'}
                </Button>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}
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
                  disabled={otp.length !== 6 || verifying || !reviewId}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {verifying ? 'Verifying…' : 'Verify & Submit Feedback'}
                </Button>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}