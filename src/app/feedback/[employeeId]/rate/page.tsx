'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { RatingStars } from '@/components/molecules/RatingStars';
import { dummyEmployeeList } from '@/app/data/dummyEmployees';

export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  const employee = dummyEmployeeList.find(emp => emp.id === employeeId);

  const [rating, setRating] = useState<number | null>(null);

  if (!employee) {
    return <div>Employee not found</div>;
  }

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
        <Image
          src={employee.imageUrl}
          alt={employee.name}
          width={150}
          height={150}
          className="rounded-xl mb-4"
        />
        <h2 className="text-2xl font-semibold text-[#4B1C00]">{employee.name}</h2>
        <p className="text-lg text-gray-600">{employee.jobTitle}</p>
        <div className="mt-6">
          <RatingStars maxRating={10} onRatingSelect={setRating} />
        </div>
        <Button
          onClick={handleNext}
          className="mt-8 w-full py-3 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9]"
          disabled={!rating}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
