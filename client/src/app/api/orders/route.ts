import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const statusId = searchParams.get('statusId');

    console.log('📋 Получение заказов:', { userId, statusId });

    const where: {
      userId?: number;
      statusId?: number;
    } = {};
    
    if (userId) {
      where.userId = parseInt(userId);
    }
    
    if (statusId) {
      where.statusId = parseInt(statusId);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        service: {
          include: {
            category: true
          }
        },
        specialist: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Найдено заказов: ${orders.length}`);

    return NextResponse.json({ 
      success: true, 
      orders 
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId, specialistId, totalPrice, scheduledDate, notes } = body;

    console.log('📝 Создание заказа:', { userId, serviceId, specialistId, totalPrice, scheduledDate, notes });

    if (!userId || !serviceId || !totalPrice) {
      console.error('❌ Отсутствуют обязательные поля:', { userId, serviceId, totalPrice });
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Получаем статус "Новый"
    const newStatus = await prisma.orderStatus.findFirst({
      where: { name: 'Новый' }
    });

    if (!newStatus) {
      return NextResponse.json({ 
        error: 'Order status not found' 
      }, { status: 500 });
    }

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        serviceId: parseInt(serviceId),
        specialistId: specialistId ? parseInt(specialistId) : null,
        statusId: newStatus.id,
        totalPrice: parseFloat(totalPrice),
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        notes: notes || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        service: {
          include: {
            category: true
          }
        },
        specialist: true,
        status: true
      }
    });

    console.log('✅ Заказ создан успешно:', order.id);

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
