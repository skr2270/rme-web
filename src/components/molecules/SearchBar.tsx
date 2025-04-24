import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';

export const SearchBar: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <Input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};