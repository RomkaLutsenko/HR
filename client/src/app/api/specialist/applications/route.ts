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
    const { name, avatar, experience, description, categories, hourlyRate } = await request.json();

    // Проверяем, что пользователь является специалистом
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'SPECIALIST') {
      return NextResponse.json({ error: 'User is not a specialist' }, { status: 403 });
    }

    // Проверяем, нет ли уже активной заявки от этого пользователя
    const existingApplication = await prisma.specialistApplication.findFirst({
      where: {
        userId: payload.userId,
        status: 'PENDING'
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You already have a pending application' }, { status: 400 });
    }

    // Создаем новую заявку
    const application = await prisma.specialistApplication.create({
      data: {
        userId: payload.userId,
        name,
        avatar,
        experience,
        description,
        categories,
        hourlyRate: parseFloat(hourlyRate),
      },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      application 
    });

  } catch (error) {
    console.error('Error creating specialist application:', error);
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

    // Получаем пользователя для проверки роли
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Если это специалист, показываем только его заявки
    if (user.role === 'SPECIALIST') {
      const applications = await prisma.specialistApplication.findMany({
        where: {
          userId: payload.userId
        },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          },
          moderator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ 
        success: true, 
        applications 
      });
    }

    // Если это модератор, показываем все заявки
    if (user.role === 'MODERATOR') {
      const applications = await prisma.specialistApplication.findMany({
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          },
          moderator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ 
        success: true, 
        applications 
      });
    }

    return NextResponse.json({ error: 'Access denied' }, { status: 403 });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
