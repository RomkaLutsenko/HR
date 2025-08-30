'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/types';
import { useState } from 'react';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const newRole = user.role === 'CUSTOMER' ? 'SPECIALIST' : 'CUSTOMER';
      
      // Получаем токен из cookie
      const token = getCookie('accessToken');
      console.log('Token:', token ? 'exists' : 'not found');
      console.log('Token value:', token);
      console.log('All cookies:', document.cookie);
      
      // Декодируем токен для проверки содержимого (без верификации подписи)
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          console.log('Decoded token payload:', JSON.parse(jsonPayload));
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      
      console.log('Request headers:', headers);
      
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers,
        body: JSON.stringify({ role: newRole }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        // Обновляем страницу для применения изменений
        window.location.reload();
      } else {
        const errorData = await response.text();
        console.error('Failed to update role:', errorData);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: UserRole) => {
    return role === 'CUSTOMER' ? 'Заказчик' : 'Исполнитель';
  };

  const getRoleDescription = (role: UserRole) => {
    return role === 'CUSTOMER' 
      ? 'Вы можете заказывать услуги у специалистов'
      : 'Вы можете предоставлять услуги клиентам';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Профиль</h1>
          <p className="text-gray-600">Управление вашим аккаунтом</p>
        </div>

        {/* Карточка пользователя */}
        <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
          {/* Аватар и основная информация */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white font-bold">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.username || 'Пользователь'
              }
            </h2>
            {user.username && (
              <p className="text-gray-500 text-sm">@{user.username}</p>
            )}
          </div>

          {/* Информация о пользователе */}
          <div className="space-y-4">
            {/* ID пользователя */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">ID пользователя:</span>
              <span className="font-mono text-sm text-gray-800">{user.id}</span>
            </div>

            {/* Telegram ID */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Telegram ID:</span>
              <span className="font-mono text-sm text-gray-800">{user.telegramId}</span>
            </div>

            {/* Номер телефона */}
            {user.phoneNumber && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Телефон:</span>
                <span className="text-gray-800">{user.phoneNumber}</span>
              </div>
            )}

            {/* Дата регистрации */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Дата регистрации:</span>
              <span className="text-gray-800 text-sm">
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            {/* Статус администратора */}
            {user.isAdmin && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Статус:</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  Администратор
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Карточка роли */}
        <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ваша роль</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
              user.role === 'CUSTOMER' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              <span className="mr-2">
                {user.role === 'CUSTOMER' ? '👤' : '🛠️'}
              </span>
              {getRoleLabel(user.role)}
            </div>
            <p className="text-gray-600 text-sm">{getRoleDescription(user.role)}</p>
          </div>

          {/* Кнопка переключения роли */}
          <button
            onClick={handleRoleToggle}
            disabled={isLoading}
            className={`color-black border-amber-50 w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Переключение...
              </div>
            ) : (
              `Переключиться на ${user.role === 'CUSTOMER' ? 'Исполнителя' : 'Заказчика'}`
            )}
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-gray-600">Заказов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">0</div>
              <div className="text-sm text-gray-600">Отзывов</div>
            </div>
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="text-center text-gray-500 text-sm">
          <p>Версия приложения: 1.0.0</p>
          <p className="mt-1">© 2024 HR Services</p>
        </div>
      </div>
    </div>
  );
}
