import { prisma } from '@/server/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      categories 
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
