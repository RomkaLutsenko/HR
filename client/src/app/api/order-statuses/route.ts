import { prisma } from '@/server/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orderStatuses = await prisma.orderStatus.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      orderStatuses 
    });

  } catch (error) {
    console.error('Error fetching order statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
