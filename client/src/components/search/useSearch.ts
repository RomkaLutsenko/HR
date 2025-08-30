import { Service } from '@/types/types';
import { api } from '@/utils/api';
import { useCallback, useEffect, useState } from 'react';

interface UseSearchProps {
  onSearchResults?: (services: Service[]) => void;
  categoryId?: number;
}

export const useSearch = ({ onSearchResults, categoryId }: UseSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      onSearchResults?.([]);
      return;
    }

    setIsSearching(true);
    try {
      const services = await api.searchServices(term, categoryId);
      onSearchResults?.(services);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults?.([]);
    } finally {
      setIsSearching(false);
    }
  }, [onSearchResults, categoryId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    isSearching,
    handleSearch
  };
};
