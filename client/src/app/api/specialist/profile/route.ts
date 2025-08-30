import { prisma } from '@/server/prisma';
import { verifyJWT } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Верифицируем JWT токен
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Получаем данные профиля из тела запроса
    const { name, experience, description, hourlyRate, categories, isAvailable } = await request.json();

    // Проверяем, что пользователь является специалистом
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'SPECIALIST') {
      return NextResponse.json({ error: 'User is not a specialist' }, { status: 403 });
    }

    // Создаем или обновляем профиль специалиста
    const specialist = await prisma.specialist.upsert({
      where: { id: payload.userId },
      update: {
        name,
        experience,
        description,
        hourlyRate,
        categories,
        isAvailable,
      },
      create: {
        id: payload.userId,
        name,
        experience,
        description,
        hourlyRate,
        categories,
        isAvailable,
      },
    });

    return NextResponse.json({ 
      success: true, 
      specialist 
    });

  } catch (error) {
    console.error('Error saving specialist profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Верифицируем JWT токен
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Получаем профиль специалиста
    const specialist = await prisma.specialist.findUnique({
      where: { id: payload.userId },
    });

    if (!specialist) {
      return NextResponse.json({ error: 'Specialist profile not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      specialist 
    });

  } catch (error) {
    console.error('Error fetching specialist profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
