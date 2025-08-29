import { prisma } from '@/server/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';


const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  id: number;
  telegramId: string;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function GET(req: NextRequest) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        telegramId: user.telegramId.toString(),
        isAuthenticated: true,
      },
    });

  } catch (error) {
    console.error('Failed to authenticate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
