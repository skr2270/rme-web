import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';

interface CategoryFilterProps {
  categories: string[];
  onCategorySelect: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategorySelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (category: string) => {
    const newSelection = selected === category ? null : category;
    setSelected(newSelection);
    onCategorySelect(newSelection);
  };

  return (
    <div className="flex justify-around mb-4 flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => handleClick(category)}
          className={`px-3 py-1 text-sm text-[#800080] border border-[#800080] rounded-full ${
            selected === category ? 'bg-[#800080] text-white' : 'hover:bg-[#800080] hover:text-white'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};