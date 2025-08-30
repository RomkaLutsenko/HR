import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

import AdminPanel from '@/components/sections/AdminPanel';
import Cart from '@/components/sections/Cart';
import CategoryView from '@/components/sections/CategoryView';
import MainMenu from '@/components/sections/MainMenu';
import Offers from '@/components/sections/Offers';
import Profile from '@/components/sections/Profile';
import Purchased from '@/components/sections/Purchased';
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
    case 'purchased':
      return <Purchased />;
    case 'reviews':
      return <Reviews />;
    case 'adminPanel':
      return <AdminPanel />;
    case 'profile':
      return <Profile />;
    default:
      return null;
  }
}
