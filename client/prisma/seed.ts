import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create service categories
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

  // Create specialists
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

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Косметический ремонт",
        description: "Обновление интерьера: покраска стен, замена обоев, обновление потолка",
        price: 2500,
        duration: 240,
        categoryId: categories[0].id,
        rating: 4.8,
        reviewCount: 89,
        isPopular: true,
        image: "🏠",
        specialists: {
          connect: [{ id: specialists[0].id }]
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Генеральная уборка",
        description: "Тщательная уборка всех помещений с дезинфекцией",
        price: 2000,
        duration: 180,
        categoryId: categories[1].id,
        rating: 4.9,
        reviewCount: 156,
        isPopular: true,
        image: "🧹",
        specialists: {
          connect: [{ id: specialists[1].id }]
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Доставка мебели",
        description: "Доставка и сборка мебели на дому",
        price: 1500,
        duration: 120,
        categoryId: categories[2].id,
        rating: 4.7,
        reviewCount: 189,
        isPopular: true,
        image: "🪑",
        specialists: {
          connect: [{ id: specialists[2].id }]
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Бизнес-консультация",
        description: "Стратегическое планирование и развитие бизнеса",
        price: 3000,
        duration: 60,
        categoryId: categories[3].id,
        rating: 4.9,
        reviewCount: 203,
        isPopular: true,
        image: "💼",
        specialists: {
          connect: [{ id: specialists[3].id }]
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Электромонтаж",
        description: "Установка и подключение электрооборудования",
        price: 2000,
        duration: 120,
        categoryId: categories[4].id,
        rating: 4.8,
        reviewCount: 94,
        isPopular: true,
        image: "⚡",
        specialists: {
          connect: [{ id: specialists[4].id }]
        }
      }
    }),
    prisma.service.create({
      data: {
        name: "Установка сантехники",
        description: "Установка и подключение сантехнического оборудования",
        price: 2500,
        duration: 150,
        categoryId: categories[5].id,
        rating: 4.6,
        reviewCount: 67,
        isPopular: true,
        image: "🚿",
        specialists: {
          connect: [{ id: specialists[5].id }]
        }
      }
    })
  ]);

  // Create order statuses
  await Promise.all([
    prisma.orderStatus.create({
      data: {
        name: "Новый",
        color: "#0073b1",
        description: "Заказ создан и ожидает подтверждения"
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: "Подтвержден",
        color: "#00a0dc",
        description: "Заказ подтвержден и назначен специалист"
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: "В работе",
        color: "#ffa500",
        description: "Работа над заказом началась"
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: "Завершен",
        color: "#28a745",
        description: "Заказ успешно выполнен"
      }
    }),
    prisma.orderStatus.create({
      data: {
        name: "Отменен",
        color: "#dc3545",
        description: "Заказ отменен"
      }
    })
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
