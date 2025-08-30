import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isPopular = searchParams.get('isPopular');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    const where: {
      categoryId?: number;
      isPopular?: boolean;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    
    if (isPopular === 'true') {
      where.isPopular = true;
    }

    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ];
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
