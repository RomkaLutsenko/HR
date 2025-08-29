
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
    <div className="fixed bottom-0 px-5 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-gray-200 flex justify-around shadow-lg">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`flex flex-col items-center py-2 px-3 text-gray-500 text-xs cursor-pointer transition-all ${
            activeSection === item.id
              ? 'text-blue-600 bg-blue-50 rounded-lg p-1 shadow-md font-bold'
              : 'hover:text-blue-500'
          }`}
          onClick={() => {
            item.action();
            vibrate();
          }}
        >
          <div
            className={`text-lg mb-1 transition-all ${
              activeSection === item.id ? 'text-2xl' : ''
            }`}
          >
            {item.icon}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}