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

    // Получаем данные заявки из тела запроса
    const { categoryId, title, description, price, duration } = await request.json();

    // Проверяем, что пользователь является специалистом
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'SPECIALIST') {
      return NextResponse.json({ error: 'User is not a specialist' }, { status: 403 });
    }

    // Получаем специалиста
    const specialist = await prisma.specialist.findUnique({
      where: { id: payload.userId },
    });

    if (!specialist) {
      return NextResponse.json({ error: 'Specialist profile not found' }, { status: 404 });
    }

    // Создаем новую услугу
    const service = await prisma.service.create({
      data: {
        name: title,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId: parseInt(categoryId),
        specialists: {
          connect: { id: specialist.id }
        }
      },
    });

    return NextResponse.json({ 
      success: true, 
      service 
    });

  } catch (error) {
    console.error('Error creating service application:', error);
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

    // Получаем услуги специалиста
    const services = await prisma.service.findMany({
      where: {
        specialists: {
          some: {
            id: payload.userId
          }
        }
      },
      include: {
        category: true,
        reviews: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      services 
    });

  } catch (error) {
    console.error('Error fetching specialist services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
