import { Service } from '@/types/types';
import { api } from '@/utils/api';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSearchProps {
  onSearchResults?: (services: Service[]) => void;
  categoryId?: number;
}

export const useSearch = ({ onSearchResults, categoryId }: UseSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Используем ref для хранения актуальных значений
  const onSearchResultsRef = useRef(onSearchResults);
  const categoryIdRef = useRef(categoryId);
  
  // Обновляем ref при изменении пропсов
  useEffect(() => {
    onSearchResultsRef.current = onSearchResults;
    categoryIdRef.current = categoryId;
  }, [onSearchResults, categoryId]);

  const performSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      onSearchResultsRef.current?.([]);
      return;
    }

    setIsSearching(true);
    try {
      const services = await api.searchServices(term, categoryIdRef.current);
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
