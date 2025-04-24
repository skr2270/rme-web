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
    <div className="grid grid-cols-2 gap-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="text-center bg-white p-4 rounded-xl shadow"
        >
          <Image
            src={employee.imageUrl}
            alt={employee.name}
            width={120}
            height={120}
            className="rounded-xl mx-auto mb-2"
          />
          <h3 className="font-medium text-[#4B1C00]">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.jobTitle}</p>
          <Button
            onClick={() => onRateClick(employee.id)}
            className="mt-2 px-4 py-1 text-sm text-[#7C3AED] border border-[#7C3AED] rounded-full hover:bg-[#7C3AED] hover:text-white"
          >
            Rate
          </Button>
        </div>
      ))}
    </div>
  );
};