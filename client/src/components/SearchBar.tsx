'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.length > 2) {
      console.log('Searching for:', term);
    }
  };

  return (
    <div className="mx-5 my-5 relative">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">🔍</span>
      <input
        type="text"
        className="w-full pl-12 pr-5 py-3 border-2 border-gray-200 rounded-full text-base bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        placeholder="Поиск товаров..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}