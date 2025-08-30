import { prisma } from '@/server/prisma';
import { verifyJWT } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'exists' : 'missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    
    // Верифицируем JWT токен
    const payload = await verifyJWT(token);
    console.log('Payload:', payload);
    
    if (!payload) {
      console.log('Invalid token payload');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Получаем данные из тела запроса
    const { role } = await request.json();
    
    if (!role || !['CUSTOMER', 'SPECIALIST'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Обновляем роль пользователя
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { role },
      select: {
        id: true,
        telegramId: true,
        phoneNumber: true,
        username: true,
        firstName: true,
        lastName: true,
        authDate: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
        role: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        ...updatedUser,
        isAuthenticated: true,
      }
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
