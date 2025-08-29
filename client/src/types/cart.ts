import { Service, Specialist } from './types';

export interface CartItem {
  service: Service;
  specialist?: Specialist;
  quantity: number;
  notes?: string;
  scheduledDate?: string;
}

export interface CartState {
  items: CartItem[];
}