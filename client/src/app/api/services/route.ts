import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isPopular = searchParams.get('isPopular');
    const limit = searchParams.get('limit');

    const where: {
      categoryId?: number;
      isPopular?: boolean;
    } = {};
    
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    
    if (isPopular === 'true') {
      where.isPopular = true;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        specialists: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    });

    return NextResponse.json({ 
      success: true, 
      services 
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
