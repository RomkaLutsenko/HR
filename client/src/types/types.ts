
// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
        };
        sendData(data: string): void;
        showConfirm(message: string, callback: (confirmed: boolean) => void): void;
        expand(): void;
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export type UserRole = 'CUSTOMER' | 'SPECIALIST';

export interface User {
  id: number;
  telegramId: string;
  phoneNumber?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  authDate?: string | null;
  createdAt: string;
  updatedAt: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  role: UserRole | null;
}

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

// Новые типы для услуг
export interface Specialist {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  description: string;
  categories: string[];
  hourlyRate: number;
  isAvailable: boolean;
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // в минутах
  categoryId: number;
  category?: ServiceCategory;
  specialists?: Specialist[];
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  userId: number;
  serviceId: number;
  specialistId?: number;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface OrderStatus {
  id: number;
  name: string;
  color: string;
  description: string;
}

export interface Order {
  id: number;
  userId: number;
  serviceId: number;
  specialistId?: number;
  statusId: number;
  status: OrderStatus;
  totalPrice: number;
  scheduledDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  service: Service;
  specialist?: Specialist;
  user?: User;
}

export interface ServiceCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;
}