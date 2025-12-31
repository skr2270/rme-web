'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { RatingStars } from '@/components/molecules/RatingStars';
import { graphqlRequest } from '@/lib/graphql';

type PublicEmployeeProfile = {
  id: string;
  ueid?: string | null;
  name: string;
  designation?: string | null;
  photoUrl?: string | null;
};

export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = useState<PublicEmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number | null>(null);

  const avatarSrc = useMemo(() => {
    if (employee?.photoUrl) return employee.photoUrl;
    const safeName = encodeURIComponent(employee?.name || 'Employee');
    return `https://ui-avatars.com/api/?background=7C3AED&color=ffffff&name=${safeName}`;
  }, [employee?.name, employee?.photoUrl]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await graphqlRequest<{ publicEmployee: PublicEmployeeProfile }>(
          `query PublicEmployee($employeeId: String!) {
            publicEmployee(employeeId: $employeeId) {
              id
              ueid
              name
              designation
              photoUrl
            }
          }`,
          { employeeId },
          'PublicEmployee',
        );
        if (!active) return;
        setEmployee(data.publicEmployee);
      } catch (err) {
        if (!active) return;
        setEmployee(null);
        setError(err instanceof Error ? err.message : 'Unable to load employee.');
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [employeeId]);

  const handleNext = () => {
    if (rating) {
      router.push(`/feedback/${employeeId}/review?rating=${rating}`);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <button onClick={() => router.back()} className="mb-4 text-[#7C3AED] text-2xl" aria-label="Go back">
        ←
      </button>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="text-sm text-gray-600">Loading employee…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : employee ? (
          <>
            <Image
              src={avatarSrc}
              alt={employee.name}
              width={150}
              height={150}
              className="rounded-xl mb-4"
            />
            <h2 className="text-2xl font-semibold text-[#4B1C00]">{employee.name}</h2>
            <p className="text-lg text-gray-600">{employee.designation || ''}</p>
          </>
        ) : (
          <div className="text-sm text-gray-600">Employee not found</div>
        )}
        <div className="mt-6">
          <RatingStars maxRating={10} onRatingSelect={setRating} />
        </div>
        <Button
          onClick={handleNext}
          className="mt-8 w-full py-3 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9]"
          disabled={!rating || loading || !employee}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
