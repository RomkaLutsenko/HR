'use client';

import { addToCart, decreaseQuantity } from '@/store/slices/cartSlice';
import { setActiveSection } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
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
  const [selectedService, setSelectedService] = useState<any>(null);

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

  const handleAddToCart = (service: any, specialist?: any) => {
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
    <div className="px-5 slide-in">
      <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
        <button
          className="text-2xl text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all"
          onClick={() => {
            handleShowMainMenu();
            vibrate();
          }}
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">
          {currentCategory}
        </h2>
      </div>

      {/* Специалисты */}
      {specialists.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">👥 Наши специалисты</h3>
          <div className="space-y-3">
            {specialists.map((specialist) => (
              <div
                key={specialist.id}
                className={`bg-white rounded-lg p-4 border-2 transition-all cursor-pointer ${
                  selectedSpecialist === specialist.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => {
                  setSelectedSpecialist(specialist.id);
                  vibrate();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{specialist.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{specialist.name}</h4>
                    <p className="text-sm text-gray-600">{specialist.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-500">⭐ {specialist.rating}</span>
                      <span className="text-sm text-gray-500">📝 {specialist.reviewCount} отзывов</span>
                      <span className="text-sm text-gray-500">⏱️ {specialist.experience}</span>
                      <span className="text-blue-600 font-semibold">{specialist.hourlyRate} ₽/час</span>
                    </div>
                  </div>
                  {specialist.isAvailable ? (
                    <span className="text-green-600 text-sm font-medium">✓ Доступен</span>
                  ) : (
                    <span className="text-red-600 text-sm font-medium">✗ Занят</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Услуги */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🛠️ Услуги</h3>
        {services.map((service) => {
          const quantity = getQuantity(service.id, selectedSpecialist || undefined);
          const specialist = specialists.find(s => s.id === selectedSpecialist);
          
          return (
            <div
              key={service.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{service.image}</div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-blue-600 font-bold text-lg">{service.price} ₽</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">⏱️ {Math.floor(service.duration / 60)}ч</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">⭐ {service.rating}</span>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowReviews(true);
                        vibrate();
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      📝 {service.reviewCount} отзывов
                    </button>
                  </div>

                  {selectedSpecialist && specialist && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Специалист:</strong> {specialist.name} • {specialist.hourlyRate} ₽/час
                      </p>
                    </div>
                  )}

                  {quantity === 0 ? (
                    <button
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-lg font-medium transition-colors"
                      onClick={() => handleAddToCart(service, specialist)}
                      disabled={Boolean(selectedSpecialist && !specialist?.isAvailable)}
                    >
                      {selectedSpecialist && !specialist?.isAvailable ? 'Специалист занят' : 'Заказать услугу'}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-xl text-blue-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full transition-colors"
                        onClick={() => handleDecreaseQuantity(service.id, selectedSpecialist || undefined)}
                      >
                        −
                      </button>
                      <span className="text-base font-medium">{quantity}</span>
                      <button
                        className="text-xl text-blue-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full transition-colors"
                        onClick={() => handleAddToCart(service, specialist)}
                        disabled={Boolean(selectedSpecialist && !specialist?.isAvailable)}
                      >
                        +
                      </button>
                      <span className="text-sm text-green-600 font-semibold ml-2">В корзине</span>
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
