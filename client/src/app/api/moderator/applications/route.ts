import { prisma } from '@/server/prisma';
import { verifyJWT } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

// Получение всех заявок для модератора
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Верифицируем JWT токен
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Проверяем, что пользователь является модератором
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isModerator: true }
    });

    if (!user || !user.isModerator) {
      return NextResponse.json({ error: 'Access denied. Moderator access required.' }, { status: 403 });
    }

    // Получаем все заявки с группировкой по статусу
    const [pendingApplications, approvedApplications, rejectedApplications] = await Promise.all([
      prisma.specialistApplication.findMany({
        where: { status: 'PENDING' },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          },
          moderator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.specialistApplication.findMany({
        where: { status: 'APPROVED' },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          },
          moderator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.specialistApplication.findMany({
        where: { status: 'REJECTED' },
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          },
          moderator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    const totalApplications = pendingApplications.length + approvedApplications.length + rejectedApplications.length;

    return NextResponse.json({
      success: true,
      dashboard: {
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalApplications
      }
    });

  } catch (error) {
    console.error('Error fetching applications for moderator:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Обработка заявки (одобрение/отклонение)
export async function POST(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Верифицируем JWT токен
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Проверяем, что пользователь является модератором
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isModerator: true }
    });

    if (!user || !user.isModerator) {
      return NextResponse.json({ error: 'Access denied. Moderator access required.' }, { status: 403 });
    }

    // Получаем данные из тела запроса
    const { applicationId, action, comment } = await request.json();
    
    if (!applicationId || !action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Получаем заявку
    const application = await prisma.specialistApplication.findUnique({
      where: { id: parseInt(applicationId) },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ error: 'Application is already processed' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // Обновляем статус заявки
    const updatedApplication = await prisma.specialistApplication.update({
      where: { id: parseInt(applicationId) },
      data: {
        status: newStatus,
        moderatorId: payload.userId,
        moderatorComment: comment || null,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        moderator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Если заявка одобрена, создаем профиль специалиста
    if (action === 'APPROVE') {
      await prisma.specialist.create({
        data: {
          name: application.name,
          avatar: application.avatar,
          experience: application.experience,
          description: application.description,
          categories: application.categories,
          hourlyRate: application.hourlyRate,
          isAvailable: true,
        }
      });
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message: `Application ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
