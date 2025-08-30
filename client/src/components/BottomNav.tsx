
import { setActiveSection } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { UiSection } from '@/types/ui';
import { useDispatch, useSelector } from 'react-redux';

const sections: { id: UiSection; icon: string; label: string }[] = [
  { id: 'mainMenu', icon: '🏠', label: 'Главная' },
  { id: 'offers', icon: '🎯', label: 'Акции' },
  { id: 'delivery', icon: '🚚', label: 'Доставка' },
  { id: 'about', icon: 'ℹ️', label: 'О нас' },
  { id: 'reviews', icon: '⭐', label: 'Отзывы' },
];

export default function BottomNav() {
  const { activeSection } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch()

  const navItems = sections.map((section) => ({
    ...section,
    action: () => dispatch(setActiveSection(section.id)),
  }));

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full z-50 px-1 h-17">
      <div className="glass rounded-3xl border border-white/20 shadow-large backdrop-blur-xl">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <div
                key={item.id}
                className={`relative flex flex-col items-center py-2 px-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'text-primary-600 bg-white/80 shadow-medium scale-105'
                    : 'text-neutral-600 hover:text-primary-500 hover:bg-white/40'
                }`}
                onClick={() => {
                  item.action();
                  vibrate();
                }}
              >
                {/* Активный индикатор */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                )}
                
                <div
                  className={`text-xl mb-1 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  {item.icon}
                </div>
                <span className={`text-xs font-medium transition-colors ${
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
      
      {/* Индикатор безопасной зоны для iPhone */}
      <div className="h-6"></div>
    </div>
  );
}