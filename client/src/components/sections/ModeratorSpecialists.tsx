'use client';

import { Specialist } from '@/types/types';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';

export default function ModeratorSpecialists() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      setLoading(true);
      const response = await api.getModeratorSpecialists();
      if (response.success) {
        setSpecialists(response.specialists);
      }
    } catch (error) {
      console.error('Error fetching specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialistAction = async (specialistId: number, action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE') => {
    try {
      setIsProcessing(specialistId);
      const response = await api.manageSpecialist(specialistId, action);

      if (response.success) {
        await fetchSpecialists();
      }
    } catch (error) {
      console.error('Error managing specialist:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (isAvailable: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAvailable 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isAvailable ? 'Активен' : 'Неактивен'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Управление специалистами</h2>
        <div className="text-sm text-gray-500">
          Всего специалистов: {specialists.length}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Активные</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {specialists.filter(s => s.isAvailable).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Неактивные</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {specialists.filter(s => !s.isAvailable).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Услуг</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {specialists.reduce((total, s) => total + (s.services?.length || 0), 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список специалистов */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Список специалистов</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {specialists.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">Специалисты не найдены</p>
            </div>
          ) : (
            specialists.map((specialist) => (
              <div key={specialist.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {specialist.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full"
                          src={specialist.avatar}
                          alt={specialist.name}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {specialist.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{specialist.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(specialist.isAvailable)}
                        <span className="text-sm text-gray-500">
                          Рейтинг: {specialist.rating.toFixed(1)} ⭐ ({specialist.reviewCount} отзывов)
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {specialist.services?.length || 0} услуг • {specialist.hourlyRate} ₽/час
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {specialist.isAvailable ? (
                      <button
                        onClick={() => handleSpecialistAction(specialist.id, 'DEACTIVATE')}
                        disabled={isProcessing === specialist.id}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isProcessing === specialist.id ? 'Обработка...' : 'Деактивировать'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSpecialistAction(specialist.id, 'ACTIVATE')}
                        disabled={isProcessing === specialist.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isProcessing === specialist.id ? 'Обработка...' : 'Активировать'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleSpecialistAction(specialist.id, 'DELETE')}
                      disabled={isProcessing === specialist.id || (specialist.orders && specialist.orders.length > 0)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      title={specialist.orders && specialist.orders.length > 0 ? 'Нельзя удалить специалиста с активными заказами' : 'Удалить специалиста'}
                    >
                      {isProcessing === specialist.id ? 'Обработка...' : 'Удалить'}
                    </button>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Опыт работы</p>
                    <p className="text-gray-900">{specialist.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Описание</p>
                    <p className="text-gray-900">{specialist.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Категории</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {specialist.categories.map((category, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Услуги специалиста */}
                {specialist.services && specialist.services.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Услуги:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {specialist.services.slice(0, 4).map((service) => (
                        <div key={service.id} className="bg-gray-50 rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{service.name}</p>
                              <p className="text-xs text-gray-500">{service.category?.name}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{service.price} ₽</p>
                          </div>
                        </div>
                      ))}
                      {specialist.services.length > 4 && (
                        <div className="bg-gray-50 rounded-md p-3 flex items-center justify-center">
                          <p className="text-sm text-gray-500">
                            +{specialist.services.length - 4} еще
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
