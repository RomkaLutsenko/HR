import { Service } from '@/types/types';
import { api } from '@/utils/api';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSearchProps {
  onSearchResults?: (services: Service[]) => void;
}

export const useSearch = ({ onSearchResults }: UseSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Используем ref для хранения актуальных значений
  const onSearchResultsRef = useRef(onSearchResults);
  
  // Обновляем ref при изменении пропсов
  useEffect(() => {
    onSearchResultsRef.current = onSearchResults;
  }, [onSearchResults]);

  const performSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      onSearchResultsRef.current?.([]);
      return;
    }

    setIsSearching(true);
    try {
      const services = await api.searchServices(term);
      onSearchResultsRef.current?.(services);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResultsRef.current?.([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
