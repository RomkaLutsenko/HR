'use client';

import { UserRole } from '@/types/types';
import { useState } from 'react';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  isLoading?: boolean;
}

export function RoleSelection({ onRoleSelect, isLoading = false }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600 px-4">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать!</h1>
          <p className="text-white/80 text-lg">Выберите вашу роль в системе</p>
        </div>

        {/* Карточки ролей */}
        <div className="space-y-4">
          {/* Заказчик */}
          <button
            onClick={() => handleRoleSelect('CUSTOMER')}
            disabled={isLoading}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedRole === 'CUSTOMER'
                ? 'border-white bg-white/20 text-white'
                : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-1">Заказчик</h3>
                <p className="text-white/70 text-sm">
                  Заказывайте услуги у специалистов
                </p>
              </div>
            </div>
          </button>

          {/* Исполнитель */}
          <button
            onClick={() => handleRoleSelect('SPECIALIST')}
            disabled={isLoading}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedRole === 'SPECIALIST'
                ? 'border-white bg-white/20 text-white'
                : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-1">Исполнитель</h3>
                <p className="text-white/70 text-sm">
                  Предоставляйте услуги клиентам
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Индикатор загрузки */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white/80 text-sm">Сохранение выбора...</p>
          </div>
        )}

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Вы сможете изменить роль в настройках профиля
          </p>
        </div>
      </div>
    </div>
  );
}
