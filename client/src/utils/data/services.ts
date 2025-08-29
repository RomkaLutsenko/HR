import { Service, ServiceCategory, Specialist } from '@/types/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 1,
    name: "Ремонт и отделка",
    icon: "🔨",
    description: "Ремонтные работы любой сложности",
    color: "#0073b1"
  },
  {
    id: 2,
    name: "Уборка",
    icon: "🧹",
    description: "Клининговые услуги",
    color: "#00a0dc"
  },
  {
    id: 3,
    name: "Доставка",
    icon: "🚚",
    description: "Доставка и перевозки",
    color: "#0077b5"
  },
  {
    id: 4,
    name: "Консультации",
    icon: "💼",
    description: "Профессиональные консультации",
    color: "#006097"
  },
  {
    id: 5,
    name: "Электрика",
    icon: "⚡",
    description: "Электромонтажные работы",
    color: "#004182"
  },
  {
    id: 6,
    name: "Сантехника",
    icon: "🔧",
    description: "Сантехнические работы",
    color: "#002f5f"
  }
];

export const specialists: Specialist[] = [
  {
    id: 1,
    name: "Александр Петров",
    avatar: "👨‍🔧",
    rating: 4.8,
    reviewCount: 127,
    experience: "8 лет",
    description: "Мастер по ремонту и отделке. Специализация: косметический и капитальный ремонт",
    categories: ["Ремонт и отделка", "Сантехника"],
    hourlyRate: 1500,
    isAvailable: true
  },
  {
    id: 2,
    name: "Мария Сидорова",
    avatar: "👩‍💼",
    rating: 4.9,
    reviewCount: 89,
    experience: "5 лет",
    description: "Профессиональная уборщица. Генеральная и поддерживающая уборка",
    categories: ["Уборка"],
    hourlyRate: 800,
    isAvailable: true
  },
  {
    id: 3,
    name: "Дмитрий Козлов",
    avatar: "👨‍🚚",
    rating: 4.7,
    reviewCount: 156,
    experience: "12 лет",
    description: "Водитель-экспедитор. Доставка грузов любой сложности",
    categories: ["Доставка"],
    hourlyRate: 1200,
    isAvailable: true
  },
  {
    id: 4,
    name: "Елена Воробьева",
    avatar: "👩‍💻",
    rating: 4.9,
    reviewCount: 203,
    experience: "15 лет",
    description: "Бизнес-консультант. Стратегическое планирование и оптимизация",
    categories: ["Консультации"],
    hourlyRate: 2500,
    isAvailable: true
  },
  {
    id: 5,
    name: "Сергей Николаев",
    avatar: "👨‍⚡",
    rating: 4.8,
    reviewCount: 94,
    experience: "10 лет",
    description: "Электрик. Монтаж и обслуживание электрооборудования",
    categories: ["Электрика"],
    hourlyRate: 1800,
    isAvailable: true
  },
  {
    id: 6,
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
];

export const services: Service[] = [
  // Ремонт и отделка
  {
    id: 1,
    name: "Косметический ремонт",
    description: "Обновление интерьера: покраска стен, замена обоев, обновление потолка",
    price: 2500,
    duration: 240, // 4 часа
    category: "Ремонт и отделка",
    specialists: [specialists[0]],
    rating: 4.8,
    reviewCount: 89,
    isPopular: true,
    image: "🏠"
  },
  {
    id: 2,
    name: "Капитальный ремонт",
    description: "Полная перепланировка и реконструкция помещений",
    price: 15000,
    duration: 1440, // 24 часа
    category: "Ремонт и отделка",
    specialists: [specialists[0]],
    rating: 4.7,
    reviewCount: 45,
    isPopular: false,
    image: "🏗️"
  },
  {
    id: 3,
    name: "Укладка плитки",
    description: "Профессиональная укладка керамической плитки",
    price: 3500,
    duration: 300, // 5 часов
    category: "Ремонт и отделка",
    specialists: [specialists[0]],
    rating: 4.9,
    reviewCount: 67,
    isPopular: true,
    image: "🧱"
  },
  
  // Уборка
  {
    id: 4,
    name: "Генеральная уборка",
    description: "Тщательная уборка всех помещений с дезинфекцией",
    price: 2000,
    duration: 180, // 3 часа
    category: "Уборка",
    specialists: [specialists[1]],
    rating: 4.9,
    reviewCount: 156,
    isPopular: true,
    image: "🧹"
  },
  {
    id: 5,
    name: "Поддерживающая уборка",
    description: "Регулярная уборка для поддержания чистоты",
    price: 1200,
    duration: 120, // 2 часа
    category: "Уборка",
    specialists: [specialists[1]],
    rating: 4.8,
    reviewCount: 234,
    isPopular: true,
    image: "✨"
  },
  {
    id: 6,
    name: "Уборка после ремонта",
    description: "Специальная уборка после строительных работ",
    price: 3000,
    duration: 240, // 4 часа
    category: "Уборка",
    specialists: [specialists[1]],
    rating: 4.7,
    reviewCount: 78,
    isPopular: false,
    image: "🏗️🧹"
  },
  
  // Доставка
  {
    id: 7,
    name: "Доставка мебели",
    description: "Доставка и сборка мебели на дому",
    price: 1500,
    duration: 120, // 2 часа
    category: "Доставка",
    specialists: [specialists[2]],
    rating: 4.7,
    reviewCount: 189,
    isPopular: true,
    image: "🪑"
  },
  {
    id: 8,
    name: "Перевозка вещей",
    description: "Перевозка вещей при переезде",
    price: 2500,
    duration: 180, // 3 часа
    category: "Доставка",
    specialists: [specialists[2]],
    rating: 4.6,
    reviewCount: 134,
    isPopular: false,
    image: "📦"
  },
  
  // Консультации
  {
    id: 9,
    name: "Бизнес-консультация",
    description: "Стратегическое планирование и развитие бизнеса",
    price: 3000,
    duration: 60, // 1 час
    category: "Консультации",
    specialists: [specialists[3]],
    rating: 4.9,
    reviewCount: 203,
    isPopular: true,
    image: "💼"
  },
  {
    id: 10,
    name: "Финансовое планирование",
    description: "Консультации по управлению личными финансами",
    price: 2000,
    duration: 60, // 1 час
    category: "Консультации",
    specialists: [specialists[3]],
    rating: 4.8,
    reviewCount: 167,
    isPopular: false,
    image: "💰"
  },
  
  // Электрика
  {
    id: 11,
    name: "Электромонтаж",
    description: "Установка и подключение электрооборудования",
    price: 2000,
    duration: 120, // 2 часа
    category: "Электрика",
    specialists: [specialists[4]],
    rating: 4.8,
    reviewCount: 94,
    isPopular: true,
    image: "⚡"
  },
  {
    id: 12,
    name: "Ремонт электропроводки",
    description: "Диагностика и ремонт электрических сетей",
    price: 1800,
    duration: 90, // 1.5 часа
    category: "Электрика",
    specialists: [specialists[4]],
    rating: 4.7,
    reviewCount: 76,
    isPopular: false,
    image: "🔌"
  },
  
  // Сантехника
  {
    id: 13,
    name: "Установка сантехники",
    description: "Установка и подключение сантехнического оборудования",
    price: 2500,
    duration: 150, // 2.5 часа
    category: "Сантехника",
    specialists: [specialists[5]],
    rating: 4.6,
    reviewCount: 67,
    isPopular: true,
    image: "🚿"
  },
  {
    id: 14,
    name: "Ремонт сантехники",
    description: "Ремонт и обслуживание сантехнических систем",
    price: 1800,
    duration: 120, // 2 часа
    category: "Сантехника",
    specialists: [specialists[5]],
    rating: 4.5,
    reviewCount: 89,
    isPopular: false,
    image: "🔧"
  }
];

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};

export const getPopularServices = (): Service[] => {
  return services.filter(service => service.isPopular);
};

export const getSpecialistsByCategory = (category: string): Specialist[] => {
  return specialists.filter(specialist => 
    specialist.categories.includes(category)
  );
};

