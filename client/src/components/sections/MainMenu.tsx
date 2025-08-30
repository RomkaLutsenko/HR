'use client';

import { useAuth } from '@/hooks/useAuth';
import { setCurrentCategory } from '@/store/slices/uiSlice';
import { Service, ServiceCategory } from '@/types/types';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchBar from '../search/SearchBar';
import SpecialOffers from '../SpecialOffers';

export default function MainMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [services, cats] = await Promise.all([
          api.getPopularServices(6),
          api.getCategories()
        ]);
        setPopularServices(services);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShowCategory = (category: string) => {
    dispatch(setCurrentCategory(category));
    router.push('/customer/category');
  };

  const handleSearchResults = (results: Service[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="space-y-6 pt-6 pb-24">
      <SearchBar onSearchResults={handleSearchResults} />
      {!isSearching && <SpecialOffers />}
      
      {/* Результаты поиска */}
      {isSearching && (
        <div className="px-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">🔍</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Результаты поиска</h2>
            <span className="text-sm text-neutral-600">({searchResults.length})</span>
          </div>
          
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((service, index) => (
              <div
                key={service.id}
                className="glass rounded-2xl p-5 border border-white/20 hover:border-primary-300/30 hover:shadow-medium transition-all duration-300 cursor-pointer hover-lift group"
                onClick={() => {
                  dispatch(setCurrentCategory(service.category?.name || ''));
                  router.push('/customer/category');
                  vibrate();
                }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-sm">{service.image}</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 text-lg group-hover:text-primary-600 transition-colors">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-primary-600 font-bold text-lg">
                        {service.price} ₽
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-neutral-400">⏱️</span>
                        <span className="text-sm text-neutral-500">
                          {Math.floor(service.duration / 60)}ч
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-neutral-500 font-medium">
                          {service.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-neutral-400 group-hover:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Ничего не найдено</h3>
                <p className="text-sm text-neutral-600">Попробуйте изменить поисковый запрос</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Популярные услуги */}
      {!isSearching && (
        <div className="px-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">🔥</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Популярные услуги</h2>
          </div>
        
        <div className="space-y-4">
          {popularServices.slice(0, 3).map((service, index) => (
            <div
              key={service.id}
              className="glass rounded-2xl p-5 border border-white/20 hover:border-primary-300/30 hover:shadow-medium transition-all duration-300 cursor-pointer hover-lift group"
                              onClick={() => {
                  dispatch(setCurrentCategory(service.category?.name || ''));
                  router.push('/customer/category');
                  vibrate();
                }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm">{service.image}</span>
                    </div>
                    <h3 className="font-semibold text-neutral-800 text-lg group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-primary-600 font-bold text-lg">
                      {service.price} ₽
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-neutral-400">⏱️</span>
                      <span className="text-sm text-neutral-500">
                        {Math.floor(service.duration / 60)}ч
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-neutral-500 font-medium">
                        {service.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-neutral-400 group-hover:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Категории услуг */}
      {!isSearching && (
        <div className="px-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">📂</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Категории услуг</h2>
          </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="glass rounded-2xl p-5 text-center border border-white/20 hover:border-secondary-300/30 hover:shadow-medium transition-all duration-300 cursor-pointer hover-lift group"
              onClick={() => {
                handleShowCategory(category.name);
                vibrate();
              }}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-glow-purple group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-2 group-hover:text-secondary-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-neutral-600 leading-tight">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Админ-панель для администраторов */}
      {user?.isAdmin && (
        <div className="px-6">
          <button
            onClick={() => {
              router.push('/admin');
              vibrate();
            }}
            className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-soft hover:shadow-medium hover-lift group"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <span>Админ-панель</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}