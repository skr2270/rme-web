'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Modal } from '@/components/organisms/Modal';
import { graphqlRequest, normalizeIndianPhone } from '@/lib/graphql';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const employeeId = params.employeeId as string;
  const rating = searchParams.get('rating');

  const numericRating = useMemo(() => {
    const value = Number(rating);
    if (!Number.isFinite(value)) return null;
    if (value <= 0) return null;
    return value;
  }, [rating]);

  const [review, setReview] = useState('');
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const handleSubmitReview = () => {
    setError(null);
    if (!numericRating) {
      setError('Rating missing. Please go back and select a rating.');
      return;
    }
    setShowUserInfoModal(true);
  };

  const handleContinueUserInfo = async () => {
    setError(null);
    const safeName = name.trim();
    const normalizedPhone = normalizeIndianPhone(phone);
    if (!safeName) {
      setError('Please enter your name.');
      return;
    }
    if (!normalizedPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (!numericRating) {
      setError('Rating missing. Please go back and select a rating.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await graphqlRequest<{ createPublicReview: { success: boolean; reviewId?: string; message?: string; errorMessage?: string; requiresOtpVerification?: boolean } }>(
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
            rating: numericRating,
            comment: review.trim() || null,
            customerName: safeName,
            customerPhone: normalizedPhone,
          },
        },
        'CreatePublicReview',
      );

      const result = data.createPublicReview;
      if (!result.success || !result.reviewId) {
        setError(result.errorMessage || 'Unable to submit review.');
        return;
      }

      setReviewId(result.reviewId);
      setShowUserInfoModal(false);
      setShowOtpModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitOtp = async () => {
    setError(null);
    const otpValue = otp.replace(/\D/g, '');
    if (!reviewId) {
      setError('Missing review reference. Please resubmit your review.');
      return;
    }
    if (otpValue.length < 4) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }

    setVerifying(true);
    try {
      const data = await graphqlRequest<{ verifyReviewOtp: { success: boolean; token?: string; message?: string; errorMessage?: string } }>(
        `mutation VerifyReviewOtp($input: VerifyReviewOtpInput!) {
          verifyReviewOtp(input: $input) {
            success
            token
            message
            errorMessage
          }
        }`,
        { input: { reviewId, otp: otpValue } },
        'VerifyReviewOtp',
      );

      const result = data.verifyReviewOtp;
      if (!result.success) {
        setError(result.errorMessage || 'OTP verification failed.');
        return;
      }

      router.push('/feedback/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <button onClick={() => router.back()} className="mb-4 text-[#7C3AED] text-2xl" aria-label="Go back">
        ←
      </button>
      <h2 className="text-2xl font-semibold text-[#4B1C00] mb-4">
        Feel free to leave your comments here
      </h2>
      <p className="text-sm text-[#7C3AED] mb-4">Share your feedback & Win discount coupon</p>
      {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="You can write a brief about the food"
        className="w-full p-4 border border-gray-300 rounded-xl mb-4"
        rows={5}
        aria-label="Review input"
      />
      <Button
        onClick={handleSubmitReview}
        className="w-full py-3 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9]"
        disabled={!numericRating}
      >
        Submit
      </Button>
      <Modal isOpen={showUserInfoModal} onClose={() => setShowUserInfoModal(false)}>
        <div className="flex items-center gap-2 mb-4">
          <Image src="/logo.png" alt="Rate My Employee Logo" width={30} height={30} />
          <h3 className="text-lg font-semibold">Your feedback makes a difference!</h3>
        </div>
        <Input
          type="text"
          placeholder="Enter you Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full p-2 border border-[#7C3AED] rounded-full"
        />
        <Input
          type="tel"
          placeholder="Enter your phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mb-4 w-full p-2 border border-[#7C3AED] rounded-full"
        />
        <Button
          onClick={handleContinueUserInfo}
          className="w-full py-3 bg-[#7C3AED] text-white rounded-full"
          disabled={submitting}
        >
          {submitting ? 'Sending OTP…' : 'Continue'}
        </Button>
      </Modal>
      <Modal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <h3 className="text-lg font-semibold mb-2">OTP Verification</h3>
        <p className="text-sm text-gray-600 mb-4">OTP has been sent to +91 {phone}</p>
        <div className="flex justify-between mb-4">
          {Array(6).fill('').map((_, index) => (
            <input
              key={index}
              type="text"
              value={otp[index] || ''}
              onChange={(e) => {
                const newOtp = otp.split('');
                newOtp[index] = e.target.value.slice(0, 1);
                setOtp(newOtp.join(''));
              }}
              className="w-10 h-10 text-center border border-[#7C3AED] rounded-lg"
              maxLength={1}
              inputMode="numeric"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={handleSubmitOtp}
          className="w-full py-3 bg-[#7C3AED] text-white rounded-full"
          disabled={verifying}
        >
          {verifying ? 'Verifying…' : 'Submit'}
        </Button>
      </Modal>
    </div>
  );
}