import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

import About from '@/components/sections/About';
import AdminPanel from '@/components/sections/AdminPanel';
import Cart from '@/components/sections/Cart';
import CategoryView from '@/components/sections/CategoryView';
import DeliveryInfo from '@/components/sections/DeliveryInfo';
import MainMenu from '@/components/sections/MainMenu';
import Offers from '@/components/sections/Offers';
import Reviews from '@/components/sections/Reviews';
import { ReactElement } from 'react';

export function useRender(): ReactElement | null {
  const { activeSection } = useSelector((state: RootState) => state.ui);

  switch (activeSection) {
    case 'mainMenu':
      return <MainMenu />;
    case 'category':
      return <CategoryView />;
    case 'cart':
      return <Cart />;
    case 'offers':
      return <Offers />;
    case 'delivery':
      return <DeliveryInfo />;
    case 'about':
      return <About />;
    case 'reviews':
      return <Reviews />;
    case 'adminPanel':
      return <AdminPanel />;
    default:
      return null;
  }
}
