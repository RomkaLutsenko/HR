'use client';

import { useAuth } from '../hooks/useAuth';
import BottomNav from './BottomNav';
import Header from './Header';
import Main from './Main';

export function AppContent() {
  const { status } = useAuth();

  if (status === 'loading') return <div>Загрузка...</div>;
  if (status === 'error') return <div>Ошибка авторизации. Перезагрузите страницу.</div>;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      <Header />
      <Main />
      <BottomNav />
    </div>
  );
}
