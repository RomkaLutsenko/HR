import { Order, OrderStatus, Review, Service, ServiceCategory, Specialist } from '@/types/types';

const API_BASE = '/api';

// Типы для API ответов
interface ApiResponse<T> {
  success: boolean;
  [key: string]: T | boolean;
}

interface ServicesResponse extends ApiResponse<Service[]> {
  services: Service[];
}

interface CategoriesResponse extends ApiResponse<ServiceCategory[]> {
  categories: ServiceCategory[];
}

interface SpecialistsResponse extends ApiResponse<Specialist[]> {
  specialists: Specialist[];
}

interface ReviewsResponse extends ApiResponse<Review[]> {
  reviews: Review[];
}

interface OrdersResponse extends ApiResponse<Order[]> {
  orders: Order[];
}

interface OrderStatusesResponse extends ApiResponse<OrderStatus[]> {
  orderStatuses: OrderStatus[];
}



// Функции для работы с API
export const api = {
  // Категории услуг
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await fetch(`${API_BASE}/categories`);
    const data: CategoriesResponse = await response.json();
    return data.categories;
  },

  // Услуги
  async getServices(params?: {
    categoryId?: number;
    isPopular?: boolean;
    limit?: number;
  }): Promise<Service[]> {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params?.isPopular) searchParams.append('isPopular', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/services?${searchParams}`);
    const data: ServicesResponse = await response.json();
    return data.services;
  },

  async getServicesByCategory(categoryName: string): Promise<Service[]> {
    // Сначала получаем категорию по имени
    const categories = await this.getCategories();
    const category = categories.find(c => c.name === categoryName);
    
    if (!category) return [];
    
    return this.getServices({ categoryId: category.id });
  },

  async getPopularServices(limit: number = 6): Promise<Service[]> {
    return this.getServices({ isPopular: true, limit });
  },

  // Специалисты
  async getSpecialists(params?: {
    category?: string;
    limit?: number;
  }): Promise<Specialist[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/specialists?${searchParams}`);
    const data: SpecialistsResponse = await response.json();
    return data.specialists;
  },

  async getSpecialistsByCategory(categoryName: string): Promise<Specialist[]> {
    return this.getSpecialists({ category: categoryName });
  },

  // Отзывы
  async getReviews(params?: {
    serviceId?: number;
    specialistId?: number;
    limit?: number;
  }): Promise<Review[]> {
    const searchParams = new URLSearchParams();
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId.toString());
    if (params?.specialistId) searchParams.append('specialistId', params.specialistId.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/reviews?${searchParams}`);
    const data: ReviewsResponse = await response.json();
    return data.reviews;
  },

  async createReview(reviewData: {
    userId: number;
    serviceId: number;
    specialistId?: number;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    const data = await response.json();
    return data.review;
  },

  // Заказы
  async getOrders(params?: {
    userId?: number;
    statusId?: number;
  }): Promise<Order[]> {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append('userId', params.userId.toString());
    if (params?.statusId) searchParams.append('statusId', params.statusId.toString());

    const response = await fetch(`${API_BASE}/orders?${searchParams}`);
    const data: OrdersResponse = await response.json();
    return data.orders;
  },

  async createOrder(orderData: {
    userId: number;
    serviceId: number;
    specialistId?: number;
    totalPrice: number;
    scheduledDate?: string;
    notes?: string;
  }): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    return data.order;
  },

  async updateOrder(orderId: number, updateData: {
    statusId?: number;
    specialistId?: number;
    scheduledDate?: string;
    notes?: string;
  }): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    return data.order;
  },

  async getOrder(orderId: number): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${orderId}`);
    const data = await response.json();
    return data.order;
  },

  // Статусы заказов
  async getOrderStatuses(): Promise<OrderStatus[]> {
    const response = await fetch(`${API_BASE}/order-statuses`);
    const data: OrderStatusesResponse = await response.json();
    return data.orderStatuses;
  },

  // Модератор API
  async getModeratorApplications(): Promise<{ success: boolean; dashboard: unknown }> {
    const response = await fetch(`${API_BASE}/moderator/applications`);
    return response.json();
  },

  async processApplication(applicationId: number, action: 'APPROVE' | 'REJECT', comment?: string): Promise<{ success: boolean; application?: unknown; message: string }> {
    const response = await fetch(`${API_BASE}/moderator/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ applicationId, action, comment }),
    });
    return response.json();
  },

  async getModeratorSpecialists(): Promise<{ success: boolean; specialists: Specialist[] }> {
    const response = await fetch(`${API_BASE}/moderator/specialists`);
    return response.json();
  },

  async manageSpecialist(specialistId: number, action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE'): Promise<{ success: boolean; specialist?: Specialist; message: string }> {
    const response = await fetch(`${API_BASE}/moderator/specialists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ specialistId, action }),
    });
    return response.json();
  },
};
