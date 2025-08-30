'use client';

import { addToCart, decreaseQuantity } from '@/store/slices/cartSlice';
import { setActiveSection } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { Service, Specialist } from '@/types/types';
import { getServicesByCategory, getSpecialistsByCategory } from '@/utils/data/services';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Reviews from './Reviews';

export default function CategoryView() {
  const dispatch = useDispatch();
  const { currentCategory } = useSelector((state: RootState) => state.ui);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services = getServicesByCategory(currentCategory);
  const specialists = getSpecialistsByCategory(currentCategory);

  const handleShowMainMenu = () => {
    dispatch(setActiveSection('mainMenu'));
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const getQuantity = (serviceId: number, specialistId?: number) => {
    const item = cartItems.find((i) => 
      i.service.id === serviceId && i.specialist?.id === specialistId
    );
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (service: Service, specialist?: Specialist) => {
    dispatch(addToCart({ 
      service, 
      specialist,
      notes: '',
      scheduledDate: ''
    }));
    vibrate();
  };

  const handleDecreaseQuantity = (serviceId: number, specialistId?: number) => {
    dispatch(decreaseQuantity({ serviceId, specialistId }));
    vibrate();
  };

  return (
    <div className="px-6 pb-24">
      {/* Заголовок */}
      <div className="flex items-center mb-6 pb-4 border-b border-white/20">
        <button
          className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center text-white shadow-glow hover:shadow-medium transition-all duration-300 hover:scale-105"
          onClick={() => {
            handleShowMainMenu();
            vibrate();
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-neutral-800">{currentCategory}</h2>
          <p className="text-sm text-neutral-600">{services.length} услуг доступно</p>
        </div>
      </div>

      {/* Специалисты */}
      {specialists.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Наши специалисты</h3>
          </div>
          
          <div className="space-y-4">
            {specialists.map((specialist, index) => (
              <div
                key={specialist.id}
                className={`glass rounded-2xl p-5 border transition-all duration-300 cursor-pointer hover-lift ${
                  selectedSpecialist === specialist.id 
                    ? 'border-primary-300/50 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 shadow-medium' 
                    : 'border-white/20 hover:border-primary-300/30 shadow-soft'
                }`}
                onClick={() => {
                  setSelectedSpecialist(specialist.id);
                  vibrate();
                }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-neutral-800 text-lg">{specialist.name}</h4>
                      {specialist.isAvailable ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Доступен</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">Занят</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{specialist.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-neutral-600 font-medium">{specialist.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-neutral-400">📝</span>
                        <span className="text-sm text-neutral-600">{specialist.reviewCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-neutral-400">⏱️</span>
                        <span className="text-sm text-neutral-600">{specialist.experience}</span>
                      </div>
                      <span className="text-primary-600 font-bold">{specialist.hourlyRate} ₽/час</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Услуги */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🛠️</span>
          </div>
          <h3 className="text-xl font-bold text-neutral-800">Услуги</h3>
        </div>
        
        {services.map((service, index) => {
          const quantity = getQuantity(service.id, selectedSpecialist || undefined);
          const specialist = specialists.find(s => s.id === selectedSpecialist);
          
          return (
            <div
              key={service.id}
              className="glass rounded-2xl p-5 border border-white/20 hover:border-primary-300/30 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-2">{service.name}</h4>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-primary-600 font-bold text-lg">{service.price} ₽</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-neutral-400">⏱️</span>
                      <span className="text-sm text-neutral-600">{Math.floor(service.duration / 60)}ч</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-neutral-600 font-medium">{service.rating}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowReviews(true);
                        vibrate();
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      📝 {service.reviewCount} отзывов
                    </button>
                  </div>

                  {selectedSpecialist && specialist && (
                                          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-3 mb-4 border border-primary-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">{specialist.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary-800">
                            {specialist.name} • {specialist.hourlyRate} ₽/час
                          </span>
                        </div>
                      </div>
                  )}

                  {quantity === 0 ? (
                    <button
                      className="bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-soft hover:shadow-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleAddToCart(service, specialist)}
                      disabled={Boolean(selectedSpecialist && !specialist?.isAvailable)}
                    >
                      {selectedSpecialist && !specialist?.isAvailable ? 'Специалист занят' : 'Заказать услугу'}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button
                        className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                        onClick={() => handleDecreaseQuantity(service.id, selectedSpecialist || undefined)}
                      >
                        <span className="text-lg font-bold text-neutral-600">−</span>
                      </button>
                      <span className="text-lg font-bold text-neutral-800 min-w-[2rem] text-center">{quantity}</span>
                      <button
                        className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                        onClick={() => handleAddToCart(service, specialist)}
                        disabled={Boolean(selectedSpecialist && !specialist?.isAvailable)}
                      >
                        <span className="text-lg font-bold text-primary-600">+</span>
                      </button>
                      <div className="flex items-center space-x-2 text-green-600">
                        <span className="text-sm">✓</span>
                        <span className="text-sm font-medium">В корзине</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showReviews && selectedService && (
        <Reviews
          service={selectedService}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
}
