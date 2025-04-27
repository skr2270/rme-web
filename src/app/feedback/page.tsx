'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { CategoryFilter } from '@/components/molecules/CategoryFilter';
import { EmployeeList } from '@/components/organisms/EmployeeList';
import { Button } from '@/components/atoms/Button';
import { dummyEmployeeList } from '@/app/data/dummyEmployees';

const categories = ["Managers", "Staff", "Executives", "Cooks", "Cashier"];

export default function FeedbackPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleRateClick = (id: string) => {
    router.push(`/feedback/${id}/rate`);
  };

  const employees = selectedCategory
    ? dummyEmployeeList.filter(emp => emp.jobTitle === selectedCategory)
    : dummyEmployeeList;

  return (
    <div className="min-h-screen p-4">
      <Header />
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#4B1C00]">Feedback Made Simple</h2>
        <p className="text-sm text-gray-600">
          Your voice reaches the owner directly — helping improve service.
        </p>
      </div>
      <CategoryFilter categories={categories} onCategorySelect={setSelectedCategory} />
      <EmployeeList employees={employees} onRateClick={handleRateClick} />
      <Button className="w-full py-2 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9] mt-4">
        View all →
      </Button>
      <div className="mt-6 bg-[#7C3AED] text-white p-4 rounded-xl flex flex-col items-center">
        <p className="text-sm mb-2 text-center">
          Rate overall service and provide feedback to help improve experience.
        </p>
        <Button className="w-full py-2 bg-white text-[#7C3AED] rounded-full hover:bg-gray-200">
          Rate Us
        </Button>
      </div>
    </div>
  );
}
