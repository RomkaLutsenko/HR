'use client';

import { Order, Service, Specialist } from '@/types/types';
import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'specialists'>('orders');

  // Моковые данные для демонстрации
  const orders: Order[] = [
    {
      id: 1,
      userId: 1,
      serviceId: 1,
      specialistId: 1,
      status: { id: 1, name: 'Новый', color: '#3b82f6', description: 'Заказ создан' },
      totalPrice: 2500,
      scheduledDate: '2024-01-20T10:00:00Z',
      notes: 'Нужно прийти к 10:00',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      service: {
        id: 1,
        name: 'Косметический ремонт',
        description: 'Обновление интерьера',
        price: 2500,
        duration: 240,
        category: 'Ремонт и отделка',
        specialists: [],
        rating: 4.8,
        reviewCount: 89,
        isPopular: true,
        image: '🏠'
      },
      specialist: {
        id: 1,
        name: 'Александр Петров',
        avatar: '👨‍🔧',
        rating: 4.8,
        reviewCount: 127,
        experience: '8 лет',
        description: 'Мастер по ремонту',
        categories: ['Ремонт и отделка'],
        hourlyRate: 1500,
        isAvailable: true
      }
    }
  ];

  const services: Service[] = [
    {
      id: 1,
      name: 'Косметический ремонт',
      description: 'Обновление интерьера: покраска стен, замена обоев',
      price: 2500,
      duration: 240,
      category: 'Ремонт и отделка',
      specialists: [],
      rating: 4.8,
      reviewCount: 89,
      isPopular: true,
      image: '🏠'
    }
  ];

  const specialists: Specialist[] = [
    {
      id: 1,
      name: 'Александр Петров',
      avatar: '👨‍🔧',
      rating: 4.8,
      reviewCount: 127,
      experience: '8 лет',
      description: 'Мастер по ремонту и отделке',
      categories: ['Ремонт и отделка', 'Сантехника'],
      hourlyRate: 1500,
      isAvailable: true
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (color: string) => {
    return { backgroundColor: color + '20', color: color };
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">⚙️ Админ-панель</h2>
        <div className="text-sm text-gray-500">Управление системой</div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 Заказы ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'services'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🛠️ Услуги ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('specialists')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'specialists'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 Специалисты ({specialists.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Заказы</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Новый заказ
            </button>
          </div>
          
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{order.service.image}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{order.service.name}</h4>
                    <p className="text-sm text-gray-600">Заказ #{order.id}</p>
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={getStatusColor(order.status.color)}
                >
                  {order.status.name}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Специалист:</span>
                  <div className="font-medium">{order.specialist?.name}</div>
                </div>
                <div>
                  <span className="text-gray-500">Сумма:</span>
                  <div className="font-medium text-blue-600">{order.totalPrice} ₽</div>
                </div>
                <div>
                  <span className="text-gray-500">Дата:</span>
                  <div className="font-medium">{formatDate(order.scheduledDate || '')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Создан:</span>
                  <div className="font-medium">{formatDate(order.createdAt)}</div>
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Заметки:</span>
                  <div className="text-sm">{order.notes}</div>
                </div>
              )}
              
              <div className="flex space-x-2 mt-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                  Изменить статус
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm transition-colors">
                  Подробности
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Услуги</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Добавить услугу
            </button>
          </div>
          
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{service.image}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{service.price} ₽</div>
                  <div className="text-sm text-gray-500">⭐ {service.rating}</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex space-x-4">
                  <span>⏱️ {Math.floor(service.duration / 60)}ч</span>
                  <span>📝 {service.reviewCount} отзывов</span>
                  <span className={service.isPopular ? 'text-green-600' : 'text-gray-500'}>
                    {service.isPopular ? '🔥 Популярная' : 'Обычная'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specialists Tab */}
      {activeTab === 'specialists' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Специалисты</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Добавить специалиста
            </button>
          </div>
          
          {specialists.map((specialist) => (
            <div key={specialist.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{specialist.avatar}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{specialist.name}</h4>
                    <p className="text-sm text-gray-600">{specialist.experience} опыта</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{specialist.hourlyRate} ₽/час</div>
                  <div className="text-sm text-gray-500">⭐ {specialist.rating}</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{specialist.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex space-x-4">
                  <span>📝 {specialist.reviewCount} отзывов</span>
                  <span className={specialist.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {specialist.isAvailable ? '✓ Доступен' : '✗ Занят'}
                  </span>
                  <span className="text-gray-500">
                    {specialist.categories.join(', ')}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



