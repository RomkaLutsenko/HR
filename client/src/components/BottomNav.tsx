'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

const customerSections: { id: string; icon: string; label: string; path: string }[] = [
  { id: 'mainMenu', icon: '🏠', label: 'Главная', path: '/customer' },
  { id: 'offers', icon: '🎯', label: 'Акции', path: '/customer/offers' },
  { id: 'purchased', icon: 'ℹ️', label: 'Покупки', path: '/customer/purchased' },
  { id: 'profile', icon: '👤', label: 'Профиль', path: '/customer/profile' },
];

const specialistSections: { id: string; icon: string; label: string; path: string }[] = [
  { id: 'specialistDashboard', icon: '🛠️', label: 'Работа', path: '/specialist' },
  { id: 'profile', icon: '👤', label: 'Профиль', path: '/specialist/profile' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const sections = user?.role === 'SPECIALIST' ? specialistSections : customerSections;

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    vibrate();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-6 lg:px-8 pb-2 sm:pb-4">
      <div className="max-w-md mx-auto">
        <div className="glass rounded-2xl border border-white/20 shadow-large backdrop-blur-xl">
          <div className="flex justify-between items-center">
            {sections.map((item) => {
              const isActive = pathname === item.path;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col items-center py-2 px-2 sm:px-3 md:px-4 rounded-2xl cursor-pointer transition-all duration-300 flex-1 min-w-0 ${
                    isActive
                      ? 'text-primary-600 bg-white/80 shadow-medium scale-105'
                      : 'text-neutral-600 hover:text-primary-500 hover:bg-white/40'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  {/* Активный индикатор */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                  )}
                  
                  <div
                    className={`text-lg sm:text-xl mb-1 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium transition-colors truncate w-full text-center ${
                    isActive ? 'font-semibold' : ''
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Эффект свечения для активного элемента */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-sm"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Индикатор безопасной зоны для iPhone */}
      <div className="h-6"></div>
    </div>
  );
}