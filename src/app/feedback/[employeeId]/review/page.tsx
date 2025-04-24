'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Modal } from '@/components/organisms/Modal';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const employeeId = params.employeeId as string;
  const rating = searchParams.get('rating');

  const [review, setReview] = useState('');
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmitReview = () => {
    setShowUserInfoModal(true);
  };

  const handleContinueUserInfo = () => {
    setShowUserInfoModal(false);
    setShowOtpModal(true);
  };

  const handleSubmitOtp = () => {
    router.push('/feedback/thank-you');
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
        >
          Continue
        </Button>
      </Modal>
      <Modal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <h3 className="text-lg font-semibold mb-2">OTP Verification</h3>
        <p className="text-sm text-gray-600 mb-4">OTP has been sent to +91 {phone}</p>
        <div className="flex justify-between mb-4">
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
              className="w-10 h-10 text-center border border-[#7C3AED] rounded-lg"
            />
          ))}
        </div>
        <Button
          onClick={handleSubmitOtp}
          className="w-full py-3 bg-[#7C3AED] text-white rounded-full"
        >
          Submit
        </Button>
      </Modal>
    </div>
  );
}