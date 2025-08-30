const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Проверяем данные в базе...\n');

    // Проверяем категории
    const categories = await prisma.serviceCategory.findMany();
    console.log(`📂 Категории услуг: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.icon})`);
    });

    // Проверяем услуги
    const services = await prisma.service.findMany();
    console.log(`\n🔥 Всего услуг: ${services.length}`);
    
    const popularServices = await prisma.service.findMany({
      where: { isPopular: true }
    });
    console.log(`🔥 Популярных услуг: ${popularServices.length}`);
    
    popularServices.forEach(service => {
      console.log(`  - ${service.name} (${service.price} ₽)`);
    });

    // Проверяем специалистов
    const specialists = await prisma.specialist.findMany();
    console.log(`\n👥 Специалистов: ${specialists.length}`);

  } catch (error) {
    console.error('❌ Ошибка при проверке данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
