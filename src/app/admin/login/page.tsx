'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { graphqlRequest } from '@/lib/graphql';
import { setAdminToken } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const otp = useMemo(() => otpDigits.join(''), [otpDigits]);

  const normalizedPhone = useMemo(() => {
    const digits = (phoneNumber || '').replace(/\D/g, '').slice(0, 10);
    return digits ? `+91${digits}` : '';
  }, [phoneNumber]);

  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{
        sendLoginOtp: { success: boolean; errorMessage?: string | null };
      }>(
        `mutation SendLoginOtp($input: SendLoginInput!) {
          sendLoginOtp(input: $input) {
            success
            errorMessage
          }
        }`,
        { input: { phoneNumber: normalizedPhone, role: 'SUPER_ADMIN' } },
        'SendLoginOtp',
      );

      if (!data.sendLoginOtp?.success) {
        throw new Error(data.sendLoginOtp?.errorMessage || 'Failed to send OTP');
      }
      setStep('otp');
      setTimeout(() => otpRefs[0].current?.focus(), 80);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{
        verifyLoginOtp: { verified: boolean; token?: string | null; errorMessage?: string | null };
      }>(
        `mutation VerifyLoginOtp($input: VerifyLoginInput!) {
          verifyLoginOtp(input: $input) {
            verified
            token
            errorMessage
          }
        }`,
        { input: { phoneNumber: normalizedPhone, otp, role: 'SUPER_ADMIN' } },
        'VerifyLoginOtp',
      );

      if (!data.verifyLoginOtp?.verified || !data.verifyLoginOtp?.token) {
        throw new Error(data.verifyLoginOtp?.errorMessage || 'OTP verification failed');
      }
      setAdminToken(data.verifyLoginOtp.token, 'SUPER_ADMIN');
      router.replace('/admin/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const setOtpAt = (idx: number, value: string) => {
    const raw = (value || '').replace(/\D/g, '');
    if (raw.length > 1) {
      const next = [...otpDigits];
      for (let i = 0; i < 4; i += 1) next[i] = raw[i] || '';
      setOtpDigits(next);
      const last = Math.min(3, raw.length - 1);
      otpRefs[last].current?.focus();
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="text-3xl font-extrabold text-gray-900">Super Admin Login</div>
        <div className="mt-2 text-gray-500">Login using your mobile number and OTP.</div>

        {step === 'phone' && (
          <div className="mt-8 space-y-4 text-left">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">+91</div>
              <Input
                type="tel"
                placeholder="Enter 10 digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-14 pr-5 py-4 border-2 border-violet-200 rounded-2xl text-base"
                maxLength={10}
              />
            </div>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <Button
              onClick={sendOtp}
              disabled={!normalizedPhone || loading}
              className="w-full bg-violet-700 hover:bg-violet-800 text-white py-4 rounded-2xl font-bold"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="mt-8 space-y-6">
            <div className="text-gray-600">OTP sent to {normalizedPhone}</div>
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  value={otpDigits[idx]}
                  onChange={(e) => setOtpAt(idx, e.target.value)}
                  className="w-14 h-14 rounded-2xl border-2 border-violet-300 text-center text-2xl font-bold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <Button
              onClick={verifyOtp}
              disabled={otp.length !== 4 || loading}
              className="w-full bg-violet-700 hover:bg-violet-800 text-white py-4 rounded-2xl font-bold"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
