'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { graphqlRequest } from '@/lib/graphql';

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

type RatingTextRow = {
  categoryId: number;
  rating: number;
  text: string;
};

const RATINGS = Array.from({ length: 10 }, (_, i) => i + 1);
const ITEM_HEIGHT = 56;

export default function RateEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;
  const searchParams = useSearchParams();

  const businessIdFromRoute = searchParams.get('business_id');
  const locationIdFromRoute = searchParams.get('location_id');

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<PublicEmployeeProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<PublicBusinessProfile | null>(null);
  const [ratingTexts, setRatingTexts] = useState<Record<number, string>>({});
  const [rating, setRating] = useState<number>(8);
  const initialRatingRef = useRef<number>(rating);

  const businessId = businessIdFromRoute || employee?.business_id || null;
  const categoryId = businessProfile?.category ?? null;

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
        setRatingTexts({});
        return;
      }
      try {
        const data = await graphqlRequest<{ ratingTextsByCategory: RatingTextRow[] }>(
          `query RatingTextsByCategory($categoryId: Int!) {
            ratingTextsByCategory(categoryId: $categoryId) {
              categoryId
              rating
              text
            }
          }`,
          { categoryId },
          'RatingTextsByCategory',
        );
        if (!active) return;
        const map: Record<number, string> = {};
        for (const row of data.ratingTextsByCategory || []) {
          map[row.rating] = row.text;
        }
        setRatingTexts(map);
      } catch {
        if (!active) return;
        setRatingTexts({});
      }
    })();

    return () => {
      active = false;
    };
  }, [categoryId]);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const top = (initialRatingRef.current - 1) * ITEM_HEIGHT;
    el.scrollTo({ top });
  }, []);

  const ratingLine = useMemo(() => {
    const text = ratingTexts[rating];
    if (!text) return `${rating}`;
    return `${rating} • ${text}`;
  }, [rating, ratingTexts]);

  const handleScroll = () => {
    const el = wheelRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const value = Math.min(10, Math.max(1, idx + 1));
    setRating(value);
  };

  const handleNext = () => {
    if (!employee) return;
    const params = new URLSearchParams();
    params.set('rating', String(rating));
    const effectiveBusinessId = businessId || '';
    const effectiveLocationId = locationIdFromRoute || employee.location_id || '';
    if (effectiveBusinessId) params.set('business_id', effectiveBusinessId);
    if (effectiveLocationId) params.set('location_id', effectiveLocationId);
    router.push(`/feedback/${employeeId}/review?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Edit Feedback</h1>
          </div>

          {loading ? (
            <div className="text-sm text-gray-600 text-center">Loading…</div>
          ) : !employee ? (
            <div className="text-sm text-gray-600 text-center">Employee not found.</div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {employee.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={employee.photoUrl}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                      {(employee.name || 'E')
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join('')}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-bold text-gray-900 leading-tight">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.designation || '—'}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">{rating}/10</div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-3">Select rating</div>

                <div className="relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-14 rounded-xl border border-violet-200 bg-violet-50/60 pointer-events-none" />
                  <div
                    ref={wheelRef}
                    onScroll={handleScroll}
                    className="h-64 overflow-y-auto snap-y snap-mandatory [scrollbar-width:none]"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div style={{ height: ITEM_HEIGHT * 2 }} />
                    {RATINGS.map((r) => (
                      <div
                        key={r}
                        className="snap-center flex items-center justify-center"
                        style={{ height: ITEM_HEIGHT }}
                      >
                        <div className={r === rating ? 'text-3xl font-extrabold text-gray-900' : 'text-2xl font-bold text-gray-400'}>
                          {r}
                        </div>
                      </div>
                    ))}
                    <div style={{ height: ITEM_HEIGHT * 2 }} />
                  </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-700 font-semibold">{ratingLine}</div>

                <Button
                  onClick={handleNext}
                  className="w-full mt-6 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-3 px-6 rounded-xl font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                >
                  Next
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