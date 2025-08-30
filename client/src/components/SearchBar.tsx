'use client';
import { Service } from '@/types/types';
import { api } from '@/utils/api';
import { useCallback, useEffect, useState } from 'react';

interface SearchBarProps {
  onSearchResults?: (services: Service[]) => void;
  categoryId?: number;
  placeholder?: string;
}

export default function SearchBar({ onSearchResults, categoryId, placeholder = "Поиск услуг..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
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

  // Debounced search с увеличенной задержкой
  useEffect(() => {
    if (searchTerm.length < 2) {
      onSearchResults?.([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 800); // Увеличили задержку до 800мс

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch, onSearchResults]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
      performSearch(searchTerm.trim());
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim().length >= 2) {
      performSearch(searchTerm.trim());
    }
  };

  return (
    <div className="px-6 py-4">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        {/* Фоновый эффект */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl blur-xl"></div>
        
        {/* Основной контейнер */}
        <div className="relative glass rounded-2xl border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300">
          <div className="flex items-center px-4 py-3">
            {/* Иконка поиска */}
            <button
              onClick={handleSearchClick}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-3 shadow-glow hover:shadow-medium transition-all duration-200 hover:scale-105"
            >
              <span className="text-white text-lg">🔍</span>
            </button>
            
            {/* Поле ввода */}
            <input
              type="text"
              className="flex-1 bg-transparent text-neutral-800 placeholder-neutral-500 text-base font-medium focus:outline-none"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            
            {/* Индикатор загрузки */}
            {isSearching && (
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            
            {/* Кнопка очистки */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Эффект фокуса */}
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-sm animate-pulse-soft"></div>
        )}
      </div>
      
      {/* Подсказка */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="mt-3 text-center">
          <p className="text-sm text-neutral-600">
            Введите минимум 2 символа для поиска
          </p>
        </div>
      )}
      
      {searchTerm.length >= 2 && isSearching && (
        <div className="mt-3 text-center">
          <p className="text-sm text-neutral-600">
            Выполняется поиск...
          </p>
        </div>
      )}
    </div>
  );
}