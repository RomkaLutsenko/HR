'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/types';
import { useState } from 'react';
import SpecialistApplications from './SpecialistApplications';



export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      let newRole: UserRole;
      if (user.role === 'CUSTOMER') {
        newRole = 'SPECIALIST';
      } else if (user.role === 'SPECIALIST') {
        newRole = 'CUSTOMER';
      } else {
        newRole = 'CUSTOMER';
      }
      
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      });
      
      if (response.ok) {
        // Обновляем страницу для применения изменений
        window.location.reload();
      } else {
        console.error('Failed to update role');
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

  const getRoleLabel = (role: UserRole | null) => {
    if (!role) return 'Роль не выбрана';
    if (role === 'CUSTOMER') return 'Заказчик';
    if (role === 'SPECIALIST') return 'Исполнитель';
    return 'Неизвестная роль';
  };

  const getRoleDescription = (role: UserRole | null) => {
    if (!role) return 'Выберите роль в настройках';
    if (role === 'CUSTOMER') return 'Вы можете заказывать услуги у специалистов';
    if (role === 'SPECIALIST') return 'Вы можете предоставлять услуги клиентам';
    return 'Описание роли недоступно';
  };

  return (
    <div className="px-6 pt-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white text-lg">👤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Профиль</h2>
            <p className="text-sm text-neutral-600">Управление вашим аккаунтом</p>
          </div>
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
            <h2 className="text-xl font-semibold text-neutral-800 mb-1">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.username || 'Пользователь'
              }
            </h2>
            {user.username && (
              <p className="text-neutral-500 text-sm">@{user.username}</p>
            )}
          </div>

          {/* Информация о пользователе */}
          <div className="space-y-4">
            {/* ID пользователя */}
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-neutral-600">ID пользователя:</span>
              <span className="font-mono text-sm text-neutral-800">{user.id}</span>
            </div>

            {/* Telegram ID */}
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-neutral-600">Telegram ID:</span>
              <span className="font-mono text-sm text-neutral-800">{user.telegramId}</span>
            </div>

            {/* Номер телефона */}
            {user.phoneNumber && (
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-neutral-600">Телефон:</span>
                <span className="text-neutral-800">{user.phoneNumber}</span>
              </div>
            )}

            {/* Дата регистрации */}
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <span className="text-neutral-600">Дата регистрации:</span>
              <span className="text-neutral-800 text-sm">
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            {/* Статус администратора */}
            {user.isAdmin && (
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-neutral-600">Статус:</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  Администратор
                </span>
              </div>
            )}
            
            {/* Статус модератора */}
            {user.isModerator && (
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-neutral-600">Статус:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  Модератор
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Карточка роли */}
        <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Ваша роль</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
              !user.role 
                ? 'bg-neutral-100 text-neutral-800'
                : user.role === 'CUSTOMER' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-secondary-100 text-secondary-800'
            }`}>
              <span className="mr-2">
                {!user.role ? '❓' : user.role === 'CUSTOMER' ? '👤' : '🛠️'}
              </span>
              {getRoleLabel(user.role)}
            </div>
            <p className="text-neutral-600 text-sm">{getRoleDescription(user.role)}</p>
          </div>

          {/* Кнопки переключения роли */}
          <div className="space-y-3">
            {/* Кнопка переключения между Заказчиком и Исполнителем */}
            <button
              onClick={handleRoleToggle}
              disabled={isLoading || !user.role}
              className={`color-black border-amber-50 w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                isLoading || !user.role
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Переключение...
                </div>
              ) : !user.role ? (
                'Сначала выберите роль'
              ) : (
                `Переключиться на ${user.role === 'CUSTOMER' ? 'Исполнителя' : 'Заказчика'}`
              )}
            </button>
            
            {/* Кнопка перехода в панель модератора */}
            {user.isModerator && (
              <button
                onClick={() => window.location.href = '/moderator'}
                className="w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95 text-white"
              >
                Перейти в панель модератора
              </button>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-neutral-600">Заказов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">0</div>
              <div className="text-sm text-neutral-600">Отзывов</div>
            </div>
          </div>
        </div>

        {/* Заявки специалиста */}
        {user.role === 'SPECIALIST' && (
          <div className="glass rounded-3xl p-6 border border-white/20 shadow-large">
            <SpecialistApplications />
          </div>
        )}

        {/* Информация о приложении */}
        <div className="text-center text-neutral-500 text-sm">
          <p>Версия приложения: 1.0.0</p>
          <p className="mt-1">© 2025 HR Services</p>
        </div>
      </div>
    </div>
  );
}
