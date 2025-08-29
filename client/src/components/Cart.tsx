'use client';

import { setActiveSection } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

export default function CartButton() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCart = () => {
    dispatch(setActiveSection('cart'));
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      className="relative w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-lg shadow-md hover:scale-105 transition-all cursor-pointer"
      onClick={() => {
        handleCart();
        vibrate();
      }}
    >
      💼
      {totalCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {totalCount}
        </div>
      )}
    </div>
  );
}
