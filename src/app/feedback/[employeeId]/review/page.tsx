'use client';

import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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

type Step = 'review' | 'details' | 'otp';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function StarRow({
  value,
  onChange,
  ariaLabelPrefix,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabelPrefix: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        const active = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className={active ? 'text-yellow-400 text-3xl leading-none' : 'text-gray-300 text-3xl leading-none'}
            aria-label={`${ariaLabelPrefix} ${starValue} of 5`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const employeeId = params.employeeId as string;
  const rating = Number(searchParams.get('rating') || '0');

  const businessIdFromRoute = searchParams.get('business_id');

  const [step, setStep] = useState<Step>('review');

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<PublicEmployeeProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<PublicBusinessProfile | null>(null);

  const [comment, setComment] = useState('');
  const [questions, setQuestions] = useState<Array<{ question: number; text: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const businessId = businessIdFromRoute || employee?.business_id || null;
  const categoryId = businessProfile?.category ?? null;

  const otp = useMemo(() => otpDigits.join(''), [otpDigits]);

  const canSubmitFeedback = useMemo(() => {
    if (!rating || rating < 1 || rating > 10) return false;
    if (!questions.length) return true;
    return questions.every((q) => (answers[q.question] || 0) > 0);
  }, [answers, questions, rating]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
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
      } catch (e) {
        if (!active) return;
        setEmployee(null);
        setLoadError(e instanceof Error ? e.message : 'Unable to load employee.');
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

  useEffect(() => {
    if (step !== 'otp') return;
    const t = setTimeout(() => otpRefs[0].current?.focus(), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goBack = () => {
    if (step === 'details') setStep('review');
    if (step === 'otp') setStep('details');
  };

  const setOtpAt = (idx: number, value: string) => {
    const raw = (value || '').replace(/\D/g, '');

    // Paste support
    if (raw.length > 1) {
      const next = [...otpDigits];
      for (let i = 0; i < 4; i++) next[i] = raw[i] || '';
      setOtpDigits(next);
      const lastFilled = clamp(raw.length - 1, 0, 3);
      otpRefs[lastFilled].current?.focus();
      return;
    }

    const digit = raw.slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });

    if (digit && idx < 3) otpRefs[idx + 1].current?.focus();
  };

  const onOtpKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') return;

    if (otpDigits[idx]) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[idx] = '';
        return next;
      });
      return;
    }

    if (idx > 0) otpRefs[idx - 1].current?.focus();
  };

  const submitDetails = async () => {
    const customerName = name.trim();
    const customerPhone = normalizeIndianPhone(phone);

    if (!customerName || !customerPhone) return;

    setSubmitting(true);
    setError(null);
    try {
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
            q1Rating: answers[1] || null,
            q2Rating: answers[2] || null,
            q3Rating: answers[3] || null,
            q4Rating: answers[4] || null,
            comment: comment.trim() || null,
            customerName,
            customerPhone,
            sendOtp: true,
          },
        },
        'CreatePublicReview',
      );

      const res = data.createPublicReview;
      if (!res?.success) throw new Error(res?.errorMessage || 'Unable to submit review.');

      const id = res.reviewId || null;
      if (!id) throw new Error('Review submitted but reviewId is missing.');

      if (res.requiresOtpVerification) {
        setReviewId(id);
        setOtpDigits(['', '', '', '']);
        setStep('otp');
      } else {
        router.push(`/feedback/thank-you?reviewId=${encodeURIComponent(id)}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitOtp = async () => {
    if (!reviewId) return;
    if ((otp || '').trim().length !== 4) return;

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

      router.push(`/feedback/thank-you?reviewId=${encodeURIComponent(reviewId)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OTP verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (!rating || rating < 1 || rating > 10) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <div className="text-2xl font-extrabold text-gray-900">Invalid rating</div>
          <div className="mt-3 text-gray-600">Please go back and select a rating.</div>
          <div className="mt-8">
            <Button
              onClick={() => router.replace(`/feedback/${employeeId}/rate`)}
              className="bg-violet-700 hover:bg-violet-800 text-white py-3 px-6 rounded-2xl font-bold"
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="px-6 pt-10 pb-6">
          {(step === 'details' || step === 'otp') && (
            <button type="button" onClick={goBack} className="text-violet-700 font-semibold text-sm" aria-label="Go back">
              Back
            </button>
          )}
        </div>

        {/* Step 1: comments + questions */}
        {step === 'review' && (
          <>
            <div className="flex-1 px-6 pb-28">
              <div className="text-[44px] font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                Feel free to leave your
                <br />
                comments here
              </div>

              <div className="mt-10 rounded-3xl border-2 border-gray-200 bg-white p-5">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="You can write a brief about the food"
                  className="w-full outline-none resize-none text-gray-900 text-base placeholder-gray-400"
                  rows={7}
                  aria-label="Comments"
                />
              </div>

              {loading ? (
                <div className="mt-6 text-sm text-gray-600">Loading…</div>
              ) : !employee ? (
                <div className="mt-6 text-sm text-gray-600">
                  {loadError ? (
                    <div className="space-y-2">
                      <div>Unable to load right now. Please try again.</div>
                      <div className="text-xs text-gray-500">{loadError}</div>
                      <button type="button" onClick={() => window.location.reload()} className="text-violet-700 font-semibold hover:text-violet-800">
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div>Employee not found.</div>
                  )}
                </div>
              ) : null}

              {questions.length ? (
                <div className="mt-10 space-y-7">
                  {questions.map((q) => {
                    const value = answers[q.question] || 0;
                    return (
                      <div key={q.question}>
                        <div className="text-base font-semibold text-gray-900 mb-3">{q.text}</div>
                        <StarRow
                          value={value}
                          onChange={(v) => setAnswers((prev) => ({ ...prev, [q.question]: v }))}
                          ariaLabelPrefix={`Question ${q.question} rating`}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
              <div className="max-w-md mx-auto p-5">
                <Button
                  onClick={() => {
                    if (!canSubmitFeedback) return;
                    setError(null);
                    setStep('details');
                  }}
                  disabled={!canSubmitFeedback}
                  className="w-full bg-violet-700 hover:bg-violet-800 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
                >
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: name + phone */}
        {step === 'details' && (
          <>
            <div className="flex-1 px-6 pb-28">
              <div className="text-[44px] font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                Feel free to leave your
                <br />
                comments here
              </div>

              <div className="mt-8 text-lg text-gray-500">
                Share your feedback <span className="text-violet-700 font-semibold">&amp; Win discount coupon</span>
              </div>

              <div className="mt-10 relative">
                <div className="absolute -inset-x-6 -bottom-24 h-64 bg-[radial-gradient(circle_at_bottom,rgba(167,139,250,0.35),transparent_60%)]" />

                <div className="relative rounded-[44px] bg-white shadow-[0_18px_55px_rgba(167,139,250,0.25)] border border-violet-100 overflow-hidden">
                  <div className="p-7">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-violet-700 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/stars/h_star.svg" alt="Star" className="w-7 h-7" draggable={false} />
                      </div>
                      <div className="text-2xl font-extrabold text-gray-900 leading-tight">Your feedback makes a difference!</div>
                    </div>

                    <div className="mt-10 space-y-6">
                      <Input
                        type="text"
                        placeholder="Enter you Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-7 py-5 bg-white border-2 border-violet-700/70 rounded-full focus:border-violet-800 focus:ring-2 focus:ring-violet-500/15 transition-all text-gray-900 text-lg placeholder-gray-300"
                      />

                      <div className="relative">
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">+91</div>
                        <Input
                          type="tel"
                          placeholder="Enter your phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-20 pr-7 py-5 bg-white border-2 border-violet-700/70 rounded-full focus:border-violet-800 focus:ring-2 focus:ring-violet-500/15 transition-all text-gray-900 text-lg placeholder-gray-300"
                        />
                      </div>
                    </div>

                    {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
              <div className="max-w-md mx-auto p-5">
                <Button
                  onClick={submitDetails}
                  disabled={!name.trim() || !phone.trim() || submitting}
                  className="w-full bg-violet-700 hover:bg-violet-800 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Continue'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: OTP */}
        {step === 'otp' && (
          <>
            <div className="flex-1 px-6 pb-28">
              <div className="text-[56px] font-extrabold text-gray-900 leading-[0.95] tracking-tight">
                OTP
                <br />
                Verification
              </div>

              <div className="mt-8 text-lg text-gray-600">OTP has been sent to {normalizeIndianPhone(phone)}</div>

              <div className="mt-14 flex items-center justify-center gap-5">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    value={otpDigits[idx]}
                    onChange={(e) => setOtpAt(idx, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(idx, e)}
                    className="w-20 h-20 rounded-3xl border-[3px] border-violet-700/70 text-center text-3xl font-extrabold text-gray-900 outline-none focus:border-violet-900 focus:ring-2 focus:ring-violet-500/15"
                    aria-label={`OTP digit ${idx + 1}`}
                  />
                ))}
              </div>

              {error ? <div className="mt-8 text-sm text-red-600 text-center">{error}</div> : null}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
              <div className="max-w-md mx-auto p-5">
                <Button
                  onClick={submitOtp}
                  disabled={verifying || otp.trim().length !== 4 || !reviewId}
                  className="w-full bg-violet-700 hover:bg-violet-800 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
                >
                  {verifying ? 'Verifying…' : 'Submit'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
