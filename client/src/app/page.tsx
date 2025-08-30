'use client';

import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { RoleSelection } from '@/components/RoleSelection';
import MainMenu from '@/components/sections/MainMenu';
import { RedirectScreen } from '@/components/WelcomeScreen';
import { useAuth } from '@/hooks/useAuth';
import { useWebApp } from '@/hooks/useWebApp';
import { UserRole } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const isTgWebApp = useWebApp();
  const { status, user } = useAuth();
  const router = useRouter();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    if (status === 'ok' && user?.role) {
      if (user.role === 'SPECIALIST') {
        router.push('/specialist');
      } else if (user.role === 'MODERATOR') {
        router.push('/moderator');
      } else {
        router.push('/customer');
      }
    }
  }, [status, user, router]);

  if (isTgWebApp === null) return null;

  if (!isTgWebApp) {
    return <RedirectScreen />;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка авторизации</h2>
          <p className="text-red-100 mb-6">Не удалось загрузить данные. Попробуйте перезагрузить страницу.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 shadow-lg"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  // Если роль не выбрана, показываем выбор роли
  if (status === 'ok' && !user?.role) {
    const handleRoleSelect = async (role: UserRole) => {
      setIsUpdatingRole(true);
      try {
        const response = await fetch('/api/auth/update-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });

        if (response.ok) {
          // Перезагружаем страницу для обновления данных пользователя
          window.location.reload();
        } else {
          alert('Ошибка при сохранении роли');
        }
      } catch (error) {
        console.error('Error updating role:', error);
        alert('Ошибка при сохранении роли');
      } finally {
        setIsUpdatingRole(false);
      }
    };

    return <RoleSelection onRoleSelect={handleRoleSelect} isLoading={isUpdatingRole} />;
  }

  // Если роль выбрана и это клиент, показываем главное меню
  if (status === 'ok' && user?.role === 'CUSTOMER') {
    return (
      <div className="max-w-md mx-auto min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Фоновые декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200 to-primary-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary-200 to-accent-200 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Основной контент */}
        <div className="relative z-10">
          <Header />
          <div className="pt-6 pb-24">
            <MainMenu />
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  // Если роль выбрана, показываем загрузку (будет перенаправление)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Перенаправление...</p>
      </div>
    </div>
  );
}
