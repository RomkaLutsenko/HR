import { prisma } from '@/server/prisma';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 14;

interface JwtPayload {
  userId: number;
  telegramId: string;
  type?: string;
}

export async function POST(req: NextRequest) {
  const prod = process.env.NODE_ENV === 'production';
  const refreshTokenFromCookie = req.cookies.get('refreshToken')?.value;

  if (!refreshTokenFromCookie) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshTokenFromCookie, JWT_SECRET) as JwtPayload;

    if (decoded.type !== 'refresh') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshTokenFromCookie) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Создаем новый accessToken
    const tokenPayload = { userId: user.id, telegramId: user.telegramId };
    console.log('Refresh: Creating token with payload:', tokenPayload);
    
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    
    console.log('Refresh: Created access token:', accessToken);

    // Создаем новый refreshToken
    const newRefreshToken = jwt.sign({ userId: user.id, telegramId: user.telegramId, type: 'refresh' }, JWT_SECRET, {
        expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
    });


    const accessCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 30, // 30 минут
      path: '/',
      sameSite: 'lax',
      secure: prod,
    });

    const refreshCookie = serialize('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_IN_DAYS,
        path: '/',
        sameSite: 'lax',
        secure: prod,
      });


    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;

  } catch (error) {
    console.error('Refresh token error:', error);
    // Очищаем куки в случае ошибки
    const accessCookie = serialize('accessToken', '', { httpOnly: true, maxAge: -1, path: '/' });
    const refreshCookie = serialize('refreshToken', '', { httpOnly: true, maxAge: -1, path: '/' });
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    response.headers.set('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);
    return response

  }
}
