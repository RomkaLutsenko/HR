import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Logout API called');
  
  try {
    // Создаем ответ
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Очищаем cookies, устанавливая их с истекшим сроком действия
    const prod = process.env.NODE_ENV === 'production';
    
    console.log('Clearing accessToken cookie...');
    response.cookies.set('accessToken', '', {
      expires: new Date(0),
      path: '/',
      secure: prod,
      sameSite: 'lax',
      httpOnly: true,
    });

    console.log('Clearing refreshToken cookie...');
    response.cookies.set('refreshToken', '', {
      expires: new Date(0),
      path: '/',
      secure: prod,
      sameSite: 'lax',
      httpOnly: true,
    });

    console.log('Clearing user cookie...');
    response.cookies.set('user', '', {
      expires: new Date(0),
      path: '/',
      secure: prod,
      sameSite: 'lax',
    });

    console.log('Logout API completed successfully');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
