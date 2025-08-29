'use client';

import { useEffect, useState } from 'react';

export function useWebApp(): boolean | null {
  const [isWebApp, setIsWebApp] = useState<boolean | null>(null);

  useEffect(() => {
    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      try {
        // Проверяем, есть ли WebApp initDataUnsafe
        const isInsideWebApp = Boolean(WebApp.initDataUnsafe?.user?.id);
        setIsWebApp(isInsideWebApp);
      } catch (e) {
        console.log('Error checking WebApp:', e);
        // Если что-то пошло не так — считаем, что не Telegram
        setIsWebApp(false);
      }
    });
  }, []);

  return isWebApp;
}