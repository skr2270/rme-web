'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { SidebarNav } from '@/components/molecules/SidebarNav';
import { DashboardShell } from '@/components/organisms/DashboardShell';
import { graphqlRequest } from '@/lib/graphql';
import { clearAdminToken, getAdminRole, getAdminToken } from '@/lib/adminAuth';

type Category = { id: number; name: string };

type UnassignedQr = { id: string; code: string };

type GstinResponse = {
  success: boolean;
  business_id?: string | null;
  gstin?: string | null;
  businessName?: string | null;
  tradeName?: string | null;
  displayName?: string | null;
  category?: number | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  errorMessage?: string | null;
  alreadyExists?: boolean | null;
};

export default function AgentDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'assign'>('assign');

  const [qrCodes, setQrCodes] = useState<UnassignedQr[]>([]);
  const [selectedQr, setSelectedQr] = useState<string>('');

  const [gstin, setGstin] = useState('');
  const [gstinLoading, setGstinLoading] = useState(false);
  const [gstinData, setGstinData] = useState<GstinResponse | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otp = useMemo(() => otpDigits.join(''), [otpDigits]);
  const otpRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const role = getAdminRole();
    const t = getAdminToken();
    if (!t || role !== 'AGENT') {
      router.replace('/agent/login');
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await graphqlRequest<{ categories: Category[] }>(
          `query Categories { categories { id name } }`,
          undefined,
          'Categories',
        );
        setCategories(data.categories || []);
      } catch {
        // Ignore category errors for now.
      }
    };
    loadData();
  }, []);

  const fetchUnassigned = async () => {
    if (!token) return;
    try {
      const data = await graphqlRequest<{ unassignedQrCodes: UnassignedQr[] }>(
        `query UnassignedQrCodes($limit: Int) {
          unassignedQrCodes(limit: $limit) {
            id
            code
          }
        }`,
        { limit: 100 },
        'UnassignedQrCodes',
        { authToken: token },
      );
      setQrCodes(data.unassignedQrCodes || []);
      if (!selectedQr && data.unassignedQrCodes?.length) {
        setSelectedQr(data.unassignedQrCodes[0].code);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load QR codes');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnassigned();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace('/agent/login');
  };

  const verifyGstin = async () => {
    setGstinLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await graphqlRequest<{ verifyGstin: GstinResponse }>(
        `mutation VerifyGstin($input: VerifyGstinInput!) {
          verifyGstin(input: $input) {
            success
            business_id
            gstin
            businessName
            tradeName
            displayName
            category
            phoneNumber
            email
            address
            city
            state
            pincode
            errorMessage
            alreadyExists
          }
        }`,
        { input: { gstin } },
        'VerifyGstin',
      );

      const payload = data.verifyGstin;
      if (!payload.success) {
        throw new Error(payload.errorMessage || 'GSTIN verification failed');
      }
      setGstinData(payload);
      setDisplayName(payload.displayName || payload.businessName || '');
      setCategory(payload.category || '');
      setPhoneNumber(payload.phoneNumber || '');
      setBusinessEmail(payload.email || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'GSTIN verification failed');
    } finally {
      setGstinLoading(false);
    }
  };

  const submitDetails = async () => {
    if (!gstinData?.business_id) return;
    setDetailsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await graphqlRequest<{ submitBusinessDetails: { success: boolean; message?: string | null } }>(
        `mutation SubmitBusinessDetails($input: SubmitBusinessDetailsInput!) {
          submitBusinessDetails(input: $input) {
            success
            message
          }
        }`,
        {
          input: {
            business_id: gstinData.business_id,
            displayName,
            category: Number(category),
            phoneNumber,
            businessEmail,
          },
        },
        'SubmitBusinessDetails',
      );

      if (!data.submitBusinessDetails?.success) {
        throw new Error(data.submitBusinessDetails?.message || 'Failed to submit details');
      }
      setSuccessMessage('OTP sent to business owner phone.');
      setTimeout(() => otpRefs[0].current?.focus(), 80);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!gstinData?.business_id) return;
    setOtpLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await graphqlRequest<{ verifyOtp: { success: boolean; message?: string | null } }>(
        `mutation VerifyOtp($business_id: String!, $phoneNumber: String!, $otp: String!) {
          verifyOtp(business_id: $business_id, phoneNumber: $phoneNumber, otp: $otp) {
            success
            message
          }
        }`,
        {
          business_id: gstinData.business_id,
          phoneNumber,
          otp,
        },
        'VerifyOtp',
      );

      if (!data.verifyOtp?.success) {
        throw new Error(data.verifyOtp?.message || 'OTP verification failed');
      }

      if (!selectedQr) {
        throw new Error('Please select a QR code to assign');
      }

      await graphqlRequest(
        `mutation AssignQrCodeToBusiness($input: AssignQrCodeInput!) {
          assignQrCodeToBusiness(input: $input) { id code status }
        }`,
        { input: { code: selectedQr, business_id: gstinData.business_id } },
        'AssignQrCodeToBusiness',
        { authToken: token || undefined },
      );

      setSuccessMessage('Business verified and QR code assigned successfully.');
      setOtpDigits(['', '', '', '']);
      setGstin('');
      setGstinData(null);
      setDisplayName('');
      setCategory('');
      setPhoneNumber('');
      setBusinessEmail('');
      fetchUnassigned();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OTP verification failed');
    } finally {
      setOtpLoading(false);
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

  const IconAssign = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h10M5 12h10M5 17h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 16l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <DashboardShell
      title="Agent Dashboard"
      subtitle="Assign QR codes to onboard businesses."
      logoSrc="/RME3.png"
      logoAlt="RME"
      actions={
        <Button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl">
          Logout
        </Button>
      }
      alerts={
        <>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          {successMessage ? <div className="text-sm text-green-600">{successMessage}</div> : null}
        </>
      }
      sidebar={
        <SidebarNav
          items={[
            {
              id: 'assign',
              label: 'Assign QR Codes',
              icon: <IconAssign />,
              active: activeSection === 'assign',
              onClick: () => setActiveSection('assign'),
            },
          ]}
        />
      }
    >
      <section className="space-y-6">
        <div className="rounded-3xl bg-white border border-gray-200 p-6">
          <div className="text-lg font-bold text-gray-900">Step 1: Select Unassigned QR</div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              value={selectedQr}
              onChange={(e) => setSelectedQr(e.target.value)}
              className="w-full sm:w-2/3 px-4 py-3 rounded-2xl border border-violet-200 bg-white"
            >
              {qrCodes.map((qr) => (
                <option key={qr.id} value={qr.code}>
                  {qr.code}
                </option>
              ))}
            </select>
            <Button onClick={fetchUnassigned} className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl">Refresh</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-bold text-gray-900">Step 2: Verify GSTIN</div>
            <div className="mt-4 space-y-4">
              <Input
                type="text"
                placeholder="GSTIN"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
              <Button
                onClick={verifyGstin}
                disabled={!gstin.trim() || gstinLoading}
                className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3 rounded-2xl font-bold"
              >
                {gstinLoading ? 'Verifying…' : 'Verify GSTIN'}
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6">
            <div className="text-lg font-bold text-gray-900">Step 3: Business Details</div>
            <div className="mt-4 space-y-4">
              <Input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
              <select
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-violet-100 bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Input
                type="tel"
                placeholder="Owner phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
              <Input
                type="email"
                placeholder="Business email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
              <Button
                onClick={submitDetails}
                disabled={detailsLoading || !gstinData?.business_id || !displayName || !category || !phoneNumber || !businessEmail}
                className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3 rounded-2xl font-bold"
              >
                {detailsLoading ? 'Submitting…' : 'Submit Details'}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6">
          <div className="text-lg font-bold text-gray-900">Step 4: Verify OTP & Assign</div>
          <div className="mt-4 flex items-center justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                ref={otpRefs[idx]}
                type="text"
                inputMode="numeric"
                value={otpDigits[idx]}
                onChange={(e) => setOtpAt(idx, e.target.value)}
                className="w-14 h-14 rounded-2xl border-2 border-violet-300 text-center text-2xl font-bold"
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>
          <div className="mt-4">
            <Button
              onClick={verifyOtp}
              disabled={otp.length !== 4 || otpLoading}
              className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3 rounded-2xl font-bold"
            >
              {otpLoading ? 'Verifying…' : 'Verify OTP & Assign QR'}
            </Button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
