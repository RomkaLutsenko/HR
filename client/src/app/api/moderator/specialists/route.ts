import { prisma } from '@/server/prisma';
import { verifyJWT } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

// Получение всех специалистов для модератора
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

    // Проверяем, что пользователь является модератором
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isModerator: true }
    });

    if (!user || !user.isModerator) {
      return NextResponse.json({ error: 'Access denied. Moderator access required.' }, { status: 403 });
    }

    // Получаем всех специалистов
    const specialists = await prisma.specialist.findMany({
      include: {
        services: {
          include: {
            category: true
          }
        },
        reviews: true,
        orders: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      specialists
    });

  } catch (error) {
    console.error('Error fetching specialists for moderator:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Управление специалистами (активация/деактивация)
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

    // Проверяем, что пользователь является модератором
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isModerator: true }
    });

    if (!user || !user.isModerator) {
      return NextResponse.json({ error: 'Access denied. Moderator access required.' }, { status: 403 });
    }

    // Получаем данные из тела запроса
    const { specialistId, action } = await request.json();
    
    if (!specialistId || !action || !['ACTIVATE', 'DEACTIVATE', 'DELETE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Получаем специалиста
    const specialist = await prisma.specialist.findUnique({
      where: { id: parseInt(specialistId) },
      include: {
        services: true,
        orders: true
      }
    });

    if (!specialist) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 });
    }

    let result;

    switch (action) {
      case 'ACTIVATE':
        // Активируем специалиста (делаем доступным для заказчиков)
        result = await prisma.specialist.update({
          where: { id: parseInt(specialistId) },
          data: { isAvailable: true },
          include: {
            services: {
              include: {
                category: true
              }
            }
          }
        });
        break;

      case 'DEACTIVATE':
        // Деактивируем специалиста (скрываем от заказчиков)
        result = await prisma.specialist.update({
          where: { id: parseInt(specialistId) },
          data: { isAvailable: false },
          include: {
            services: {
              include: {
                category: true
              }
            }
          }
        });
        break;

      case 'DELETE':
        // Проверяем, есть ли активные заказы
        if (specialist.orders.length > 0) {
          return NextResponse.json({ 
            error: 'Cannot delete specialist with active orders' 
          }, { status: 400 });
        }

        // Удаляем специалиста и все его услуги
        await prisma.service.deleteMany({
          where: {
            specialists: {
              some: {
                id: parseInt(specialistId)
              }
            }
          }
        });

        result = await prisma.specialist.delete({
          where: { id: parseInt(specialistId) }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      specialist: result,
      message: `Specialist ${action.toLowerCase()}d successfully`
    });

  } catch (error) {
    console.error('Error managing specialist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
