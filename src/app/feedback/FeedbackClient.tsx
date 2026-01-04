'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { EmployeeList } from '@/components/organisms/EmployeeList';
import { Button } from '@/components/atoms/Button';
import { graphqlRequest } from '@/lib/graphql';

type PublicEmployeeProfile = {
  id: string;
  ueid?: string | null;
  name: string;
  designation?: string | null;
  photoUrl?: string | null;
};

type EmployeeCard = {
  id: string;
  name: string;
  jobTitle: string;
  imageUrl: string;
};

type PublicLocation = {
  location_id: string;
  business_id: string;
  displayName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
};

type PublicBusinessProfile = {
  business_id: string;
  displayName?: string | null;
};

export default function FeedbackClient({
  businessId,
  initialLocationId,
}: {
  businessId: string | null;
  initialLocationId?: string | null;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeCard[]>([]);
  const [locations, setLocations] = useState<PublicLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(initialLocationId || null);
  const [businessName, setBusinessName] = useState<string>('');

  const effectiveLocationId = useMemo(() => {
    if (!selectedLocationId) return null;
    if (selectedLocationId === 'ALL') return null;
    return selectedLocationId;
  }, [selectedLocationId]);

  const handleRateClick = (id: string) => {
    const params = new URLSearchParams();
    if (businessId) params.set('business_id', businessId);
    if (effectiveLocationId) params.set('location_id', effectiveLocationId);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    router.push(`/feedback/${id}/rate${suffix}`);
  };

  const locationTitle = useMemo(() => {
    if (!effectiveLocationId) return null;
    const loc = locations.find((l) => l.location_id === effectiveLocationId);
    return loc?.displayName || loc?.city || loc?.address || null;
  }, [locations, effectiveLocationId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!businessId) {
        setLoading(false);
        setEmployees([]);
        setLocations([]);
        setBusinessName('');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch public business display name (best-effort)
        try {
          const b = await graphqlRequest<{ publicBusinessProfile: PublicBusinessProfile }>(
            `query PublicBusinessProfile($businessId: String!) {
              publicBusinessProfile(businessId: $businessId) {
                business_id
                displayName
              }
            }`,
            { businessId },
            'PublicBusinessProfile',
          );
          if (active) {
            setBusinessName(b.publicBusinessProfile?.displayName || '');
          }
        } catch {
          if (active) {
            setBusinessName('');
          }
        }

        const locData = await graphqlRequest<{ publicBusinessLocationsByBusiness: PublicLocation[] }>(
          `query PublicBusinessLocationsByBusiness($businessId: String!) {
            publicBusinessLocationsByBusiness(businessId: $businessId) {
              location_id
              business_id
              displayName
              address
              city
              state
              pincode
            }
          }`,
          { businessId },
          'PublicBusinessLocationsByBusiness',
        );

        if (!active) return;
        const locList = locData.publicBusinessLocationsByBusiness || [];
        setLocations(locList);

        // If a QR provided a location_id that isn't valid for this business,
        // drop it so the user can pick.
        if (selectedLocationId && selectedLocationId !== 'ALL' && locList.length > 0) {
          const isKnown = locList.some((l) => l.location_id === selectedLocationId);
          if (!isKnown) {
            setSelectedLocationId(null);
            setEmployees([]);
            setLoading(false);
            return;
          }
        }

        // If locations exist and none selected, ask user to pick a location.
        if (locList.length > 0 && !selectedLocationId) {
          setEmployees([]);
          setLoading(false);
          return;
        }

        const useLocationFilter = Boolean(selectedLocationId && selectedLocationId !== 'ALL');
        let rawEmployees: PublicEmployeeProfile[] = [];
        if (useLocationFilter) {
          const empDataLoc = await graphqlRequest<{ publicEmployeesByLocation: PublicEmployeeProfile[] }>(
            `query PublicEmployeesByLocation($locationId: String!) {
              publicEmployeesByLocation(locationId: $locationId) {
                id
                ueid
                name
                designation
                photoUrl
              }
            }`,
            { locationId: selectedLocationId as string },
            'PublicEmployeesByLocation',
          );
          rawEmployees = empDataLoc.publicEmployeesByLocation || [];
        } else {
          const empDataBiz = await graphqlRequest<{ publicEmployeesByBusiness: PublicEmployeeProfile[] }>(
            `query PublicEmployeesByBusiness($businessId: String!) {
              publicEmployeesByBusiness(businessId: $businessId) {
                id
                ueid
                name
                designation
                photoUrl
              }
            }`,
            { businessId },
            'PublicEmployeesByBusiness',
          );
          rawEmployees = empDataBiz.publicEmployeesByBusiness || [];
        }

        if (!active) return;
        const mapped: EmployeeCard[] = rawEmployees.map((e) => {
          const imageUrl = e.photoUrl
            ? e.photoUrl
            : `https://ui-avatars.com/api/?background=7C3AED&color=ffffff&name=${encodeURIComponent(e.name || 'Employee')}`;
          return {
            id: e.id,
            name: e.name,
            jobTitle: e.designation || '—',
            imageUrl,
          };
        });

        setEmployees(mapped);
      } catch (err) {
        if (!active) return;
        setEmployees([]);
        setLocations([]);
        setError(err instanceof Error ? err.message : 'Unable to load employees.');
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [businessId, selectedLocationId]);

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <Header />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Feedback Made Simple</h1>
          <p className="text-sm text-gray-600">Your voice reaches the owner directly — helping improve service.</p>
        </div>

        {!businessId ? (
          <div className="text-sm text-gray-600 text-center">Scan a Business QR to continue.</div>
        ) : loading ? (
          <div className="text-sm text-gray-600 text-center">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600 text-center">{error}</div>
        ) : locations.length > 0 && !selectedLocationId ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="text-base font-bold text-gray-900 mb-1">{businessName || 'Business'}</div>
            <div className="text-sm text-gray-600 mb-4">Select a location</div>
            <div className="flex flex-col gap-2">
              {locations.map((loc) => {
                const label = loc.displayName || loc.city || loc.address || loc.location_id;
                const meta = [loc.address, loc.city, loc.state, loc.pincode].filter(Boolean).join(', ');
                return (
                  <Button
                    key={loc.location_id}
                    className="w-full py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700"
                    onClick={() => setSelectedLocationId(loc.location_id)}
                  >
                    {label}{meta ? ` — ${meta}` : ''}
                  </Button>
                );
              })}
              <Button
                className="w-full py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700"
                onClick={() => setSelectedLocationId('ALL')}
              >
                View all employees
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <div className="text-base font-bold text-gray-900 mb-1">{businessName || 'Business'}</div>
            {locationTitle ? <div className="text-sm text-gray-600 mb-4">Location: {locationTitle}</div> : null}
            <EmployeeList employees={employees} onRateClick={handleRateClick} />
          </div>
        )}
      </div>
    </div>
  );
}
