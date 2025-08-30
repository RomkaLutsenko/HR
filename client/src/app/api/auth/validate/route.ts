import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 14;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json({ error: 'No initData provided' }, { status: 400 });
    }

    const params = new URLSearchParams(initData);
    const userRaw = params.get('user');
    if (!userRaw) {
      return NextResponse.json({ error: 'No user info in initData' }, { status: 400 });
    }

    const userObj = JSON.parse(userRaw);
    const telegramId = userObj.id;

    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user || !user.phoneNumber) {
      return NextResponse.json({ status: 'need_phone' });
    }

    const accessToken = jwt.sign({ id: user.id, telegramId }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: user.id, telegramId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Устанавливаем заголовки Set-Cookie
    const prod = process.env.NODE_ENV === 'production';

    const accessCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 30,
      path: '/',
      sameSite: 'lax',
      secure: prod,
    });

    const refreshCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_IN_DAYS,
      path: '/',
      sameSite: 'lax',
      secure: prod,
    });

    const response = NextResponse.json({ status: 'ok', phone: user.phoneNumber });
    response.headers.set('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
