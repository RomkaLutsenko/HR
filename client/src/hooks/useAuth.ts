'use client';

import { User } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

type AuthStatus = 'loading' | 'ok' | 'need_phone' | 'error';



// Функция clearCookie больше не нужна, так как cookies httpOnly
// и могут быть очищены только сервером

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  let res = await fetch(url, { 
    ...options, 
    headers,
    credentials: 'include', // Важно для работы с cookies
  });

  if (res.status === 401) {
    // Попытка обновить токен
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (refreshRes.ok) {
      // Повторный запрос после обновления токена
      res = await fetch(url, { 
        ...options, 
        headers,
        credentials: 'include',
      });
    } else {
      // Если обновление не удалось, считаем пользователя неавторизованным
      window.location.href = '/'; // или на страницу логина
    }
  }

  return res;
}


export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStatus('ok');
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setStatus('error');
      // Если не удалось получить юзера, возможно, нужен новый вход через ТГ
      validateWithTelegram();
    }
  }, []);

  const validateWithTelegram = useCallback(() => {
    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      const initData = WebApp.initData;

      if (!initData) {
        setStatus('error');
        console.error('No initData in Telegram WebApp');
        return;
      }

      fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
           fetchUser(); // После успешной валидации получаем данные пользователя
        } else if (data.status === 'need_phone') {
          setStatus('need_phone');
           WebApp.openTelegramLink(`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=need_phone`);
        } else {
          setStatus('error');
        }
      })
      .catch(err => {
        console.error('Validation error', err);
        setStatus('error');
      });
    });
  }, [fetchUser]);


  useEffect(() => {
    // Поскольку cookies httpOnly, мы не можем их читать на клиенте
    // Поэтому всегда пытаемся получить пользователя через API
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    if (isLoggingOut) return; // Предотвращаем множественные клики
    
    console.log('Starting logout process...');
    setIsLoggingOut(true);
    
    try {
      console.log('Sending logout request...');
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для работы с cookies
      });

      console.log('Logout response status:', res.status);
      
      if (res.ok) {
        console.log('Logout successful, cookies cleared by server...');
        
        console.log('Updating state...');
        // Очищаем состояние
        setUser(null);
        setStatus('error');
        
        console.log('Redirecting to home page...');
        // Принудительно перенаправляем на главную страницу и обновляем страницу
        window.location.replace('/');
      } else {
        console.error('Logout failed with status:', res.status);
        const errorData = await res.text();
        console.error('Logout error response:', errorData);
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Даже если запрос не удался, очищаем состояние
      setUser(null);
      setStatus('error');
      // Принудительно перенаправляем на главную страницу
      window.location.replace('/');
    }
  }, [isLoggingOut]);

  return { status, user, logout, isLoggingOut };
}