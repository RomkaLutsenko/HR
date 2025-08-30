'use client';

import { useAuth } from '../hooks/useAuth';
import BottomNav from './BottomNav';
import Header from './Header';
import Main from './Main';

export function AppContent() {
  const { status } = useAuth();

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
        <Main />
        <BottomNav />
      </div>

      {/* Индикатор состояния */}
      <div className="fixed top-4 right-4 z-50">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
      </div>
    </div>
  );
}
