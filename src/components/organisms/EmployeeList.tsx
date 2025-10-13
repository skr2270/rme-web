import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  imageUrl: string;
}

interface EmployeeListProps {
  employees: Employee[];
  onRateClick: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onRateClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="group relative bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all hover:-translate-y-1"
        >
          <div className="text-center">
            <div className="relative mb-4">
              <Image
                src={employee.imageUrl}
                alt={employee.name}
                width={100}
                height={100}
                className="rounded-xl mx-auto w-20 h-20 sm:w-24 sm:h-24 object-cover"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                <span className="text-violet-600 text-xs">⭐</span>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{employee.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{employee.jobTitle}</p>
            <Button
              onClick={() => onRateClick(employee.id)}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-2 px-4 rounded-lg font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Rate Experience
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};