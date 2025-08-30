import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: {
      categories?: {
        has: string;
      };
    } = {};
    
    if (category) {
      where.categories = {
        has: category
      };
    }

    const specialists = await prisma.specialist.findMany({
      where,
      include: {
        services: {
          include: {
            category: true
          }
        },
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
      specialists 
    });

  } catch (error) {
    console.error('Error fetching specialists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
