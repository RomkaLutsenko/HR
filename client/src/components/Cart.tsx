'use client';

import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function CartButton() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCart = () => {
    router.push('/cart');
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      className="relative w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-2xl flex items-center justify-center text-white text-xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:scale-105 hover-lift"
      onClick={() => {
        handleCart();
        vibrate();
      }}
    >
      <span className="text-lg">🛒</span>
      {totalCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce-soft">
          {totalCount > 99 ? '99+' : totalCount}
        </div>
      )}
      
      {/* Эффект пульсации при наличии товаров */}
      {totalCount > 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl opacity-0 animate-pulse-soft"></div>
      )}
    </div>
  );
}
