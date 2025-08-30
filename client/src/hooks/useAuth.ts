'use client';

import { User } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

type AuthStatus = 'loading' | 'ok' | 'need_phone' | 'error';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getCookie('accessToken');

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // Попытка обновить токен
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (refreshRes.ok) {
      // Повторный запрос с новым токеном
      const newAccessToken = getCookie('accessToken');
      headers.Authorization = `Bearer ${newAccessToken}`;
      res = await fetch(url, { ...options, headers });
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
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      fetchUser();
    } else {
      validateWithTelegram();
    }
  }, [fetchUser, validateWithTelegram]);

  const logout = useCallback(async () => {
    if (isLoggingOut) return; // Предотвращаем множественные клики
    
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // Очищаем состояние
        setUser(null);
        setStatus('error');
        
        // Перенаправляем на главную страницу
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Даже если запрос не удался, очищаем состояние и перенаправляем
      setUser(null);
      setStatus('error');
      window.location.href = '/';
    }
  }, [isLoggingOut]);

  return { status, user, logout, isLoggingOut };
}