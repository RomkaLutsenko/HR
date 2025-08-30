'use client';
import { Service } from '@/types/types';
import { memo, useCallback, useState } from 'react';
import SearchInput from './SearchInput';
import { useSearch } from './useSearch';

interface SearchContainerProps {
  onSearchResults?: (services: Service[]) => void;
  placeholder?: string;
}

const SearchBar = memo(({ 
  onSearchResults, 
  placeholder = "Поиск услуг..." 
}: SearchContainerProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { searchTerm, isSearching, handleSearch } = useSearch({ onSearchResults });

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className="px-6 py-4">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl blur-xl"></div>
        
        {/* Main container */}
        <div className="relative glass rounded-2xl border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            isSearching={isSearching}
          />
        </div>
        
        {/* Focus effect */}
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-sm animate-pulse-soft"></div>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
