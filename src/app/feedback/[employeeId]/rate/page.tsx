'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function starStyle(distance: number): { scale: number; opacity: number } {
  // Active is biggest, others are smaller and fade out.
  if (distance <= 0) return { scale: 1, opacity: 1 };
  if (distance === 1) return { scale: 0.78, opacity: 0.6 };
  if (distance === 2) return { scale: 0.62, opacity: 0.35 };
  return { scale: 0.52, opacity: 0.18 };
}

export default function RateEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;
  const searchParams = useSearchParams();

  const businessIdFromRoute = searchParams.get('business_id');
  const locationIdFromRoute = searchParams.get('location_id');

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [employee, setEmployee] = useState<PublicEmployeeProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<PublicBusinessProfile | null>(null);
  const [ratingTexts, setRatingTexts] = useState<Record<number, string>>({});
  const [rating, setRating] = useState<number>(8);
  const [itemHeight, setItemHeight] = useState(72);
  const [starSizes, setStarSizes] = useState({ active: 96, inactive: 78 });
  const scrollTickRef = useRef<number | null>(null);
  const initialRatingRef = useRef<number>(rating);

  const businessId = businessIdFromRoute || employee?.business_id || null;
  const categoryId = businessProfile?.category ?? null;

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
        setLoadError(e instanceof Error ? e.message : 'Unable to load employee.');
        setEmployee(null);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [employeeId, refreshTick]);

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
    const syncSizes = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 420;
      if (width <= 380) {
        setItemHeight(64);
        setStarSizes({ active: 84, inactive: 68 });
      } else {
        setItemHeight(72);
        setStarSizes({ active: 96, inactive: 78 });
      }
    };
    syncSizes();
    window.addEventListener('resize', syncSizes);
    return () => window.removeEventListener('resize', syncSizes);
  }, []);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const top = (initialRatingRef.current - 1) * itemHeight;
    el.scrollTo({ top });
  }, [itemHeight]);

  const ratingLine = useMemo(() => {
    const text = ratingTexts[rating];
    if (!text) return `${rating}`;
    return `${rating} • ${text}`;
  }, [rating, ratingTexts]);

  const handleScroll = () => {
    const el = wheelRef.current;
    if (!el) return;
    if (scrollTickRef.current) return;
    scrollTickRef.current = window.requestAnimationFrame(() => {
      scrollTickRef.current = null;
      const idx = Math.round(el.scrollTop / itemHeight);
      const value = clamp(idx + 1, 1, 10);
      setRating(value);
    });
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Top hero */}
        <div className="relative">
          <div className="h-60 sm:h-72 bg-gradient-to-b from-violet-700 to-violet-900 overflow-hidden">
            {employee?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover opacity-95" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/90">
                <div className="text-center">
                  <div className="text-5xl font-extrabold">{(employee?.name || 'E').slice(0, 1).toUpperCase()}</div>
                  <div className="text-sm font-semibold opacity-80">Rate My Employee</div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Small badge */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stars/h_star.svg" alt="Star" className="w-7 h-7" draggable={false} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pt-6 pb-24">
          {loading ? (
            <div className="text-sm text-gray-600 text-center">Loading…</div>
          ) : !employee ? (
            <div className="text-sm text-gray-600 text-center">
              {loadError ? (
                <div className="space-y-3">
                  <div>Unable to load right now. Please try again.</div>
                  <div className="text-xs text-gray-500">{loadError}</div>
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => setRefreshTick((n) => n + 1)}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-2xl"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <div>Employee not found.</div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 break-words">{employee.name}</div>
                <div className="mt-1 text-sm sm:text-base text-gray-600 break-words">{employee.designation || '—'}</div>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[82px] rounded-3xl bg-violet-50 border border-violet-200 pointer-events-none" />

                  <div
                    ref={wheelRef}
                    onScroll={handleScroll}
                    className="h-[240px] sm:h-[320px] overflow-y-auto snap-y snap-mandatory overscroll-contain [scroll-snap-stop:always] [scrollbar-width:none]"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    aria-label="Select rating"
                  >
                    <div style={{ height: itemHeight * 2 }} />
                    {RATINGS.map((r) => {
                      const dist = Math.abs(r - rating);
                      const { scale, opacity } = starStyle(dist);
                      const size = r === rating ? starSizes.active : starSizes.inactive;

                      return (
                        <div
                          key={r}
                          className="snap-center flex items-center justify-center"
                          style={{ height: itemHeight }}
                        >
                          <div
                            className="transition-all duration-200"
                            style={{
                              transform: `scale(${scale})`,
                              opacity,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/stars/${r}.png`}
                              alt={`${r} star`}
                              width={size}
                              height={size}
                              className="select-none"
                              draggable={false}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ height: itemHeight * 2 }} />
                  </div>
                </div>

                <div className="mt-3 text-center text-sm sm:text-base font-semibold text-gray-800">{ratingLine}</div>
              </div>
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
          <div className="max-w-md mx-auto p-4">
            <Button
              onClick={handleNext}
              disabled={!employee || loading}
              className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3.5 rounded-2xl font-bold text-base sm:text-lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}