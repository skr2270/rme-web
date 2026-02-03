'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { SidebarNav } from '@/components/molecules/SidebarNav';
import { DashboardShell } from '@/components/organisms/DashboardShell';
import { graphqlRequest } from '@/lib/graphql';
import { clearAdminToken, getAdminRole, getAdminToken } from '@/lib/adminAuth';
import jsQR from 'jsqr';

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
};

declare const BarcodeDetector: {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
};

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
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'assign'>('assign');

  const [qrCodes, setQrCodes] = useState<UnassignedQr[]>([]);
  const [selectedQr, setSelectedQr] = useState<string>('');
  const [qrSearch, setQrSearch] = useState('');
  const [qrLookupValue, setQrLookupValue] = useState('');
  const [qrMethod, setQrMethod] = useState<'manual' | 'scan' | 'upload'>('manual');
  const [qrStatus, setQrStatus] = useState<'idle' | 'unassigned' | 'assigned' | 'error'>('idle');
  const [showFallback, setShowFallback] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      setAuthChecked(true);
      return;
    }
    setToken(t);
    setAuthChecked(true);
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
    setQrStatus('idle');
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

  const normalizeQrInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    try {
      const url = new URL(trimmed);
      const match = url.pathname.match(/\/qr\/code\/([^/]+)/i);
      if (match?.[1]) return decodeURIComponent(match[1]);
    } catch {
      // Not a URL, fall through
    }
    return trimmed;
  };

  const lookupQrCode = async (rawValue: string) => {
    const code = normalizeQrInput(rawValue);
    if (!code) {
      setError('Please enter or scan a valid QR code.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await graphqlRequest<{
        qrCodeLookup: {
          code: string;
          status: 'UNASSIGNED' | 'ASSIGNED' | 'RETIRED';
          assignedBusinessName?: string | null;
        };
      }>(
        `query QrCodeLookup($code: String!) {
          qrCodeLookup(code: $code) {
            code
            status
            assignedBusinessName
          }
        }`,
        { code },
        'QrCodeLookup',
        { authToken: token || undefined },
      );

      const result = data.qrCodeLookup;
      if (result.status !== 'UNASSIGNED') {
        setError(
          result.assignedBusinessName
            ? `QR code already assigned to ${result.assignedBusinessName}.`
            : 'QR code is already assigned or retired.',
        );
        setQrStatus('assigned');
        return;
      }
      setSelectedQr(result.code);
      setQrLookupValue(result.code);
      setSuccessMessage('QR code is unassigned and ready to be assigned.');
      setQrStatus('unassigned');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to lookup QR code');
      setQrStatus('error');
    }
  };

  const handleUploadQrImage = async (file?: File | null) => {
    if (!file) return;
    setUploadError(null);
    setError(null);
    setSuccessMessage(null);
    try {
      const bitmap = await createImageBitmap(file);
      let value: string | null = null;

      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(bitmap);
        if (barcodes.length) {
          value = barcodes[0].rawValue;
        }
      }

      if (!value) {
        const canvas = canvasRef.current || document.createElement('canvas');
        const maxSize = 800;
        const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
        canvas.width = Math.max(1, Math.floor(bitmap.width * scale));
        canvas.height = Math.max(1, Math.floor(bitmap.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setUploadError('Unable to read the QR image.');
          return;
        }
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = jsQR(imageData.data, imageData.width, imageData.height);
        if (decoded?.data) {
          value = decoded.data;
        }
      }

      if (!value) {
        setUploadError('No QR code found in the image.');
        return;
      }
      setQrLookupValue(value);
      lookupQrCode(value);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to read QR image.');
    }
  };

  useEffect(() => {
    const stopScanner = () => {
      if (scanTimerRef.current) {
        window.clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    if (!scanOpen) {
      stopScanner();
      return;
    }

    const startScanner = async () => {
      setScanError(null);
      if (typeof window === 'undefined') return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const detector = 'BarcodeDetector' in window ? new BarcodeDetector({ formats: ['qr_code'] }) : null;
        const canvas = canvasRef.current || document.createElement('canvas');
        scanTimerRef.current = window.setInterval(async () => {
          if (!videoRef.current) return;
          try {
            let value: string | null = null;
            if (detector) {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                value = barcodes[0].rawValue;
              }
            } else {
              const width = videoRef.current.videoWidth;
              const height = videoRef.current.videoHeight;
              if (width && height) {
                const maxSize = 800;
                const scale = Math.min(1, maxSize / Math.max(width, height));
                canvas.width = Math.max(1, Math.floor(width * scale));
                canvas.height = Math.max(1, Math.floor(height * scale));
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const decoded = jsQR(imageData.data, imageData.width, imageData.height);
                  if (decoded?.data) {
                    value = decoded.data;
                  }
                }
              }
            }

            if (value) {
              stopScanner();
              setScanOpen(false);
              setQrLookupValue(value);
              lookupQrCode(value);
            }
          } catch {
            // Ignore frame errors
          }
        }, 300);
      } catch (err) {
        setScanError(err instanceof Error ? err.message : 'Unable to access camera.');
      }
    };

    startScanner();
    return () => stopScanner();
  }, [scanOpen, token]);

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

  const filteredQrCodes = useMemo(() => {
    const query = qrSearch.trim().toLowerCase();
    if (!query) return qrCodes;
    return qrCodes.filter((qr) => qr.code.toLowerCase().includes(query));
  }, [qrCodes, qrSearch]);

  const mobileActiveStep = useMemo(() => {
    if (!gstinData?.business_id) return 'gstin';
    if (!displayName || !category || !phoneNumber || !businessEmail) return 'details';
    return 'otp';
  }, [gstinData?.business_id, displayName, category, phoneNumber, businessEmail]);

  if (!authChecked || !token) {
    return <div className="min-h-screen bg-slate-50" />;
  }

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
    <>
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xl font-bold text-gray-900">Assign QR Codes</div>
              <div className="text-sm text-gray-500">Scan or lookup a QR to check assignment status before proceeding.</div>
            </div>
            <Button onClick={fetchUnassigned} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl">
              Refresh
            </Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-600">Lookup QR</div>
                {qrStatus !== 'idle' ? (
                  <span
                    className={
                      qrStatus === 'unassigned'
                        ? 'text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : qrStatus === 'assigned'
                          ? 'text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100'
                          : 'text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100'
                    }
                  >
                    {qrStatus === 'unassigned' ? 'Unassigned' : qrStatus === 'assigned' ? 'Assigned' : 'Error'}
                  </span>
                ) : null}
              </div>

              <div className="flex gap-2 rounded-2xl bg-white p-1 border border-gray-200">
                {[
                  { key: 'manual', label: 'Manual' },
                  { key: 'scan', label: 'Scan' },
                  { key: 'upload', label: 'Upload' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setQrMethod(item.key as 'manual' | 'scan' | 'upload');
                      if (item.key === 'scan') setScanOpen(true);
                    }}
                    className={
                      qrMethod === item.key
                        ? 'flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-violet-600 text-white'
                        : 'flex-1 px-3 py-2 text-xs font-semibold rounded-xl text-gray-600'
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {(qrMethod === 'manual' || !qrMethod) && (
                <>
                  <Input
                    type="text"
                    placeholder="Paste or type QR code"
                    value={qrLookupValue}
                    onChange={(e) => setQrLookupValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white"
                  />
                  <Button
                    onClick={() => lookupQrCode(qrLookupValue)}
                    className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl"
                  >
                    Check QR
                  </Button>
                </>
              )}

              {(qrMethod === 'upload' || !qrMethod) && (
                <label className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl cursor-pointer inline-flex items-center justify-center">
                  Upload QR
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadQrImage(e.target.files?.[0])}
                  />
                </label>
              )}

              {uploadError ? <div className="text-sm text-red-600">{uploadError}</div> : null}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-600">Fallback: Select Unassigned QR</div>
                <button
                  type="button"
                  onClick={() => setShowFallback((prev) => !prev)}
                  className="text-xs font-semibold text-violet-700 hover:text-violet-800"
                >
                  {showFallback ? 'Hide' : 'Show'}
                </button>
              </div>

              {showFallback ? (
                <>
                  <div className="text-xs text-gray-500">
                    {filteredQrCodes.length} of {qrCodes.length}
                  </div>
                  <Input
                    type="text"
                    placeholder="Search QR code"
                    value={qrSearch}
                    onChange={(e) => setQrSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white"
                  />
                  <select
                    value={selectedQr}
                    onChange={(e) => setSelectedQr(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white"
                  >
                    {[
                      ...(selectedQr && !filteredQrCodes.find((qr) => qr.code === selectedQr)
                        ? [{ id: 'selected', code: selectedQr }]
                        : []),
                      ...filteredQrCodes,
                    ].map((qr) => (
                      <option key={qr.id} value={qr.code}>
                        {qr.code}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  Use this only if you cannot scan or lookup a QR.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6 space-y-6">
          <div>
            <div className="text-xl font-bold text-gray-900">Business Verification</div>
            <div className="text-sm text-gray-500">Complete GSTIN checks, business details, and OTP verification.</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">Step {mobileActiveStep === 'gstin' ? '2' : mobileActiveStep === 'details' ? '3' : '4'} of 4</span>
              <span className="text-gray-400">•</span>
              <span>{mobileActiveStep === 'gstin' ? 'Verify GSTIN' : mobileActiveStep === 'details' ? 'Business Details' : 'Verify OTP'}</span>
            </div>
          </div>

          <div className="hidden lg:grid gap-6">
            <div className="rounded-3xl border border-gray-200 p-6">
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

            <div className="rounded-3xl border border-gray-200 p-6">
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

          <div className="hidden lg:block rounded-3xl border border-gray-200 p-6">
            <div className="text-lg font-bold text-gray-900">Step 4: Verify OTP & Assign</div>
            <div className="mt-6 flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  value={otpDigits[idx]}
                  onChange={(e) => setOtpAt(idx, e.target.value)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-violet-300 text-center text-xl sm:text-2xl font-bold"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={verifyOtp}
                disabled={otp.length !== 4 || otpLoading}
                className="w-full max-w-md bg-violet-700 hover:bg-violet-800 text-white py-3 rounded-2xl font-bold"
              >
                {otpLoading ? 'Verifying…' : 'Verify OTP & Assign QR'}
              </Button>
            </div>
          </div>

          <div className="lg:hidden space-y-3">
            <details className="rounded-2xl border border-gray-200 bg-white" open={mobileActiveStep === 'gstin'}>
              <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-gray-900">Step 2: Verify GSTIN</summary>
              <div className="px-4 pb-4 space-y-4">
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
            </details>

            <details className="rounded-2xl border border-gray-200 bg-white" open={mobileActiveStep === 'details'}>
              <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-gray-900">Step 3: Business Details</summary>
              <div className="px-4 pb-4 space-y-4">
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
            </details>

            <details className="rounded-2xl border border-gray-200 bg-white" open={mobileActiveStep === 'otp'}>
              <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-gray-900">Step 4: Verify OTP & Assign</summary>
              <div className="px-4 pb-4">
                <div className="mt-4 flex items-center justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      value={otpDigits[idx]}
                      onChange={(e) => setOtpAt(idx, e.target.value)}
                      className="w-12 h-12 rounded-2xl border-2 border-violet-300 text-center text-xl font-bold"
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
            </details>
          </div>
        </div>
      </section>
    </DashboardShell>
    {scanOpen ? (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">Scan QR Code</div>
            <button
              type="button"
              onClick={() => setScanOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close scan"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 rounded-2xl overflow-hidden bg-gray-100">
            <video ref={videoRef} className="w-full h-64 object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          {scanError ? <div className="mt-3 text-sm text-red-600">{scanError}</div> : null}
          <div className="mt-4 text-sm text-gray-500">
            Point the camera at a QR code. You can also paste the code manually in the input.
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
