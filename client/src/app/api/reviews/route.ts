import { prisma } from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const specialistId = searchParams.get('specialistId');
    const limit = searchParams.get('limit');

    const where: {
      serviceId?: number;
      specialistId?: number;
    } = {};
    
    if (serviceId) {
      where.serviceId = parseInt(serviceId);
    }
    
    if (specialistId) {
      where.specialistId = parseInt(specialistId);
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        },
        specialist: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    });

    // Форматируем отзывы для фронтенда
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      serviceId: review.serviceId,
      specialistId: review.specialistId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userName: review.user.firstName && review.user.lastName 
        ? `${review.user.firstName} ${review.user.lastName}`
        : review.user.username || `Пользователь ${review.user.id}`,
      serviceName: review.service.name,
      specialistName: review.specialist?.name
    }));

    return NextResponse.json({ 
      success: true, 
      reviews: formattedReviews 
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId, specialistId, rating, comment } = body;

    if (!userId || !serviceId || !rating || !comment) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        serviceId: parseInt(serviceId),
        specialistId: specialistId ? parseInt(specialistId) : null,
        rating: parseInt(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        },
        specialist: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Обновляем рейтинг услуги
    const serviceReviews = await prisma.review.findMany({
      where: { serviceId: parseInt(serviceId) }
    });
    
    const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
    
    await prisma.service.update({
      where: { id: parseInt(serviceId) },
      data: {
        rating: avgRating,
        reviewCount: serviceReviews.length
      }
    });

    // Если есть специалист, обновляем его рейтинг
    if (specialistId) {
      const specialistReviews = await prisma.review.findMany({
        where: { specialistId: parseInt(specialistId) }
      });
      
      const specialistAvgRating = specialistReviews.reduce((sum, r) => sum + r.rating, 0) / specialistReviews.length;
      
      await prisma.specialist.update({
        where: { id: parseInt(specialistId) },
        data: {
          rating: specialistAvgRating,
          reviewCount: specialistReviews.length
        }
      });
    }

    const formattedReview = {
      id: review.id,
      userId: review.userId,
      serviceId: review.serviceId,
      specialistId: review.specialistId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userName: review.user.firstName && review.user.lastName 
        ? `${review.user.firstName} ${review.user.lastName}`
        : review.user.username || `Пользователь ${review.user.id}`,
      serviceName: review.service.name,
      specialistName: review.specialist?.name
    };

    return NextResponse.json({ 
      success: true, 
      review: formattedReview 
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
