import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers/providers';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Каталог строительных товаров',
  description: 'Все для строительства и ремонта',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  'format-detection': 'telephone=no',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}