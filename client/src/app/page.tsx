'use client';

import { AppContent } from '@/components/AppContent';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useWebApp } from '@/hooks/useWebApp';

export default function Home() {
  const isTgWebApp = useWebApp();

  if (isTgWebApp === null) return null;

  return isTgWebApp ? <AppContent /> : <WelcomeScreen />;
}
