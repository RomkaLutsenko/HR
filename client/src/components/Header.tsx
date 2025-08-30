import { useAuth } from '@/hooks/useAuth';
import CartButton from './CartButton';

export default function Header() {
  const { user } = useAuth();

  const isSpecialist = user?.role === 'SPECIALIST';

  return (
    <div className="bg-white border-b border-gray-200 text-gray-900 py-2 px-4 flex items-center justify-between shadow-sm safe-area-top">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {isSpecialist ? '🛠️ ServiceHub' : '💼 ServiceHub'}
        </h1>
        <p className="text-sm text-gray-600">
          {isSpecialist 
            ? 'Панель исполнителя' 
            : 'Профессиональные услуги для Вас'
          }
        </p>
      </div>
      {!isSpecialist && <CartButton />}
    </div>
  );
}