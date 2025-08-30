'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ModeratorLayoutProps {
  children: ReactNode;
}

export default function ModeratorLayout({ children }: ModeratorLayoutProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && (!user || user.role !== 'MODERATOR')) {
      router.push('/');
    }
  }, [user, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'MODERATOR') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Панель модератора</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
