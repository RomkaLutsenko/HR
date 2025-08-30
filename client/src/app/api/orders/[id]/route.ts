import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await request.json();
    const { statusId, specialistId, scheduledDate, notes } = body;

    const updateData: {
      statusId?: number;
      specialistId?: number | null;
      scheduledDate?: Date | null;
      notes?: string;
    } = {};
    
    if (statusId !== undefined) {
      updateData.statusId = parseInt(statusId);
    }
    
    if (specialistId !== undefined) {
      updateData.specialistId = specialistId ? parseInt(specialistId) : null;
    }
    
    if (scheduledDate !== undefined) {
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
