import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Очищаем существующие данные
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.specialist.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.orderStatus.deleteMany();

  // Создаем статусы заказов
  const orderStatuses = await Promise.all([
    prisma.orderStatus.create({
      data: {
        name: 'Новый',
        color: '#3B82F6',
        description: 'Заказ создан и ожидает подтверждения'
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: 'Подтвержден',
        color: '#10B981',
        description: 'Заказ подтвержден специалистом'
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: 'В работе',
        color: '#F59E0B',
        description: 'Работа над заказом началась'
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: 'Завершен',
        color: '#059669',
        description: 'Заказ успешно завершен'
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: 'Отменен',
        color: '#EF4444',
        description: 'Заказ отменен'
      }
    })
  ]);

  // Создаем категории услуг
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        name: "Ремонт и отделка",
        icon: "🔨",
        description: "Ремонтные работы любой сложности",
        color: "#0073b1"
      }
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Уборка",
        icon: "🧹",
        description: "Клининговые услуги",
        color: "#00a0dc"
      }
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Доставка",
        icon: "🚚",
        description: "Доставка и перевозки",
        color: "#0077b5"
      }
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Консультации",
        icon: "💼",
        description: "Профессиональные консультации",
        color: "#006097"
      }
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Электрика",
        icon: "⚡",
        description: "Электромонтажные работы",
        color: "#004182"
      }
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Сантехника",
        icon: "🔧",
        description: "Сантехнические работы",
        color: "#002f5f"
      }
    })
  ]);

  // Создаем специалистов
  const specialists = await Promise.all([
    prisma.specialist.create({
      data: {
        name: "Александр Петров",
        avatar: "👨‍🔧",
        rating: 4.8,
        reviewCount: 127,
        experience: "8 лет",
        description: "Мастер по ремонту и отделке. Специализация: косметический и капитальный ремонт",
        categories: ["Ремонт и отделка", "Сантехника"],
        hourlyRate: 1500,
        isAvailable: true
      }
    }),
    prisma.specialist.create({
      data: {
        name: "Мария Сидорова",
        avatar: "👩‍💼",
        rating: 4.9,
        reviewCount: 89,
        experience: "5 лет",
        description: "Профессиональная уборщица. Генеральная и поддерживающая уборка",
        categories: ["Уборка"],
        hourlyRate: 800,
        isAvailable: true
      }
    }),
    prisma.specialist.create({
      data: {
        name: "Дмитрий Козлов",
        avatar: "👨‍🚚",
        rating: 4.7,
        reviewCount: 156,
        experience: "12 лет",
        description: "Водитель-экспедитор. Доставка грузов любой сложности",
        categories: ["Доставка"],
        hourlyRate: 1200,
        isAvailable: true
      }
    }),
    prisma.specialist.create({
      data: {
        name: "Елена Воробьева",
        avatar: "👩‍💻",
        rating: 4.9,
        reviewCount: 203,
        experience: "15 лет",
        description: "Бизнес-консультант. Стратегическое планирование и оптимизация",
        categories: ["Консультации"],
        hourlyRate: 2500,
        isAvailable: true
      }
    }),
    prisma.specialist.create({
      data: {
        name: "Сергей Николаев",
        avatar: "👨‍⚡",
        rating: 4.8,
        reviewCount: 94,
        experience: "10 лет",
        description: "Электрик. Монтаж и обслуживание электрооборудования",
        categories: ["Электрика"],
        hourlyRate: 1800,
        isAvailable: true
      }
    }),
    prisma.specialist.create({
      data: {
        name: "Анна Морозова",
        avatar: "👩‍🔧",
        rating: 4.6,
        reviewCount: 67,
        experience: "7 лет",
        description: "Сантехник. Установка и ремонт сантехнического оборудования",
        categories: ["Сантехника"],
        hourlyRate: 1400,
        isAvailable: true
      }
    })
  ]);

  // Создаем услуги
  const services = await Promise.all([
    // Ремонт и отделка
    prisma.service.create({
      data: {
        name: "Косметический ремонт",
        description: "Обновление интерьера: покраска стен, замена обоев, обновление потолка",
        price: 2500,
        duration: 240, // 4 часа
        categoryId: categories[0].id, // Ремонт и отделка
        rating: 4.8,
        reviewCount: 89,
        isPopular: true,
        image: "🏠",
        specialists: {
          connect: [{ id: specialists[0].id }] // Александр Петров
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Капитальный ремонт",
        description: "Полная перепланировка и реконструкция помещений",
        price: 15000,
        duration: 1440, // 24 часа
        categoryId: categories[0].id, // Ремонт и отделка
        rating: 4.7,
        reviewCount: 45,
        isPopular: false,
        image: "🏗️",
        specialists: {
          connect: [{ id: specialists[0].id }] // Александр Петров
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Укладка плитки",
        description: "Профессиональная укладка керамической плитки",
        price: 3500,
        duration: 300, // 5 часов
        categoryId: categories[0].id, // Ремонт и отделка
        rating: 4.9,
        reviewCount: 67,
        isPopular: true,
        image: "🧱",
        specialists: {
          connect: [{ id: specialists[0].id }] // Александр Петров
        }
      }
    }),
    
    // Уборка
    prisma.service.create({
      data: {
        name: "Генеральная уборка",
        description: "Тщательная уборка всех помещений с дезинфекцией",
        price: 2000,
        duration: 180, // 3 часа
        categoryId: categories[1].id, // Уборка
        rating: 4.9,
        reviewCount: 156,
        isPopular: true,
        image: "🧹",
        specialists: {
          connect: [{ id: specialists[1].id }] // Мария Сидорова
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Поддерживающая уборка",
        description: "Регулярная уборка для поддержания чистоты",
        price: 1200,
        duration: 120, // 2 часа
        categoryId: categories[1].id, // Уборка
        rating: 4.8,
        reviewCount: 234,
        isPopular: true,
        image: "✨",
        specialists: {
          connect: [{ id: specialists[1].id }] // Мария Сидорова
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Уборка после ремонта",
        description: "Специальная уборка после строительных работ",
        price: 3000,
        duration: 240, // 4 часа
        categoryId: categories[1].id, // Уборка
        rating: 4.7,
        reviewCount: 78,
        isPopular: false,
        image: "🏗️🧹",
        specialists: {
          connect: [{ id: specialists[1].id }] // Мария Сидорова
        }
      }
    }),
    
    // Доставка
    prisma.service.create({
      data: {
        name: "Доставка мебели",
        description: "Доставка и сборка мебели на дому",
        price: 1500,
        duration: 120, // 2 часа
        categoryId: categories[2].id, // Доставка
        rating: 4.7,
        reviewCount: 189,
        isPopular: true,
        image: "🪑",
        specialists: {
          connect: [{ id: specialists[2].id }] // Дмитрий Козлов
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Перевозка вещей",
        description: "Перевозка вещей при переезде",
        price: 2500,
        duration: 180, // 3 часа
        categoryId: categories[2].id, // Доставка
        rating: 4.6,
        reviewCount: 134,
        isPopular: false,
        image: "📦",
        specialists: {
          connect: [{ id: specialists[2].id }] // Дмитрий Козлов
        }
      }
    }),
    
    // Консультации
    prisma.service.create({
      data: {
        name: "Бизнес-консультация",
        description: "Стратегическое планирование и развитие бизнеса",
        price: 3000,
        duration: 60, // 1 час
        categoryId: categories[3].id, // Консультации
        rating: 4.9,
        reviewCount: 203,
        isPopular: true,
        image: "💼",
        specialists: {
          connect: [{ id: specialists[3].id }] // Елена Воробьева
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Финансовое планирование",
        description: "Консультации по управлению личными финансами",
        price: 2000,
        duration: 60, // 1 час
        categoryId: categories[3].id, // Консультации
        rating: 4.8,
        reviewCount: 167,
        isPopular: false,
        image: "💰",
        specialists: {
          connect: [{ id: specialists[3].id }] // Елена Воробьева
        }
      }
    }),
    
    // Электрика
    prisma.service.create({
      data: {
        name: "Электромонтаж",
        description: "Установка и подключение электрооборудования",
        price: 2000,
        duration: 120, // 2 часа
        categoryId: categories[4].id, // Электрика
        rating: 4.8,
        reviewCount: 94,
        isPopular: true,
        image: "⚡",
        specialists: {
          connect: [{ id: specialists[4].id }] // Сергей Николаев
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Ремонт электропроводки",
        description: "Диагностика и ремонт электрических сетей",
        price: 1800,
        duration: 90, // 1.5 часа
        categoryId: categories[4].id, // Электрика
        rating: 4.7,
        reviewCount: 76,
        isPopular: false,
        image: "🔌",
        specialists: {
          connect: [{ id: specialists[4].id }] // Сергей Николаев
        }
      }
    }),
    
    // Сантехника
    prisma.service.create({
      data: {
        name: "Установка сантехники",
        description: "Установка и подключение сантехнического оборудования",
        price: 2500,
        duration: 150, // 2.5 часа
        categoryId: categories[5].id, // Сантехника
        rating: 4.6,
        reviewCount: 67,
        isPopular: true,
        image: "🚿",
        specialists: {
          connect: [{ id: specialists[5].id }] // Анна Морозова
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Ремонт сантехники",
        description: "Ремонт и обслуживание сантехнических систем",
        price: 1800,
        duration: 120, // 2 часа
        categoryId: categories[5].id, // Сантехника
        rating: 4.5,
        reviewCount: 89,
        isPopular: false,
        image: "🔧",
        specialists: {
          connect: [{ id: specialists[5].id }] // Анна Морозова
        }
      }
    })
  ]);

  // Создаем моковых пользователей для отзывов
  const users = await Promise.all([
    prisma.user.create({
      data: {
        telegramId: BigInt(123456789),
        firstName: "Анна",
        lastName: "Козлова",
        username: "anna_k"
      }
    }),
    prisma.user.create({
      data: {
        telegramId: BigInt(987654321),
        firstName: "Михаил",
        lastName: "Сидоров",
        username: "mikhail_s"
      }
    }),
    prisma.user.create({
      data: {
        telegramId: BigInt(555666777),
        firstName: "Елена",
        lastName: "Воробьева",
        username: "elena_v"
      }
    }),
    prisma.user.create({
      data: {
        telegramId: BigInt(111222333),
        firstName: "Дмитрий",
        lastName: "Петров",
        username: "dmitry_p"
      }
    }),
    prisma.user.create({
      data: {
        telegramId: BigInt(444555666),
        firstName: "Ольга",
        lastName: "Морозова",
        username: "olga_m"
      }
    })
  ]);

  // Создаем моковые отзывы
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].id,
        serviceId: services[0].id, // Косметический ремонт
        rating: 5,
        comment: "Отличный сервис! Специалист пришел вовремя, работа выполнена качественно. Рекомендую!"
      }
    }),
    prisma.review.create({
      data: {
        userId: users[1].id,
        serviceId: services[0].id, // Косметический ремонт
        rating: 4,
        comment: "Хорошая работа, но немного задержались с началом. В целом доволен результатом."
      }
    }),
    prisma.review.create({
      data: {
        userId: users[2].id,
        serviceId: services[1].id, // Капитальный ремонт
        rating: 5,
        comment: "Профессиональный подход, аккуратная работа. Буду обращаться еще!"
      }
    }),
    prisma.review.create({
      data: {
        userId: users[3].id,
        serviceId: services[1].id, // Капитальный ремонт
        rating: 5,
        comment: "Очень доволен качеством работы. Специалист знает свое дело!"
      }
    }),
    prisma.review.create({
      data: {
        userId: users[4].id,
        serviceId: services[2].id, // Укладка плитки
        rating: 4,
        comment: "Хороший сервис, но можно было бы быстрее. В целом рекомендую."
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${orderStatuses.length} order statuses`);
  console.log(`   - ${categories.length} service categories`);
  console.log(`   - ${specialists.length} specialists`);
  console.log(`   - ${services.length} services`);
  console.log(`   - ${reviews.length} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
