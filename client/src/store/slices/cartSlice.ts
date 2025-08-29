import { CartItem, CartState } from '@/types/cart';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existingItem = state.items.find(item => 
        item.service.id === action.payload.service.id && 
        item.specialist?.id === action.payload.specialist?.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<{ serviceId: number; specialistId?: number }>) {
      state.items = state.items.filter(item => 
        !(item.service.id === action.payload.serviceId && 
          item.specialist?.id === action.payload.specialistId)
      );
    },
    decreaseQuantity(state, action: PayloadAction<{ serviceId: number; specialistId?: number }>) {
      const item = state.items.find(item => 
        item.service.id === action.payload.serviceId && 
        item.specialist?.id === action.payload.specialistId
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => 
            !(i.service.id === action.payload.serviceId && 
              i.specialist?.id === action.payload.specialistId)
          );
        }
      }
    },
    updateItemNotes(state, action: PayloadAction<{ serviceId: number; specialistId?: number; notes: string }>) {
      const item = state.items.find(item => 
        item.service.id === action.payload.serviceId && 
        item.specialist?.id === action.payload.specialistId
      );
      if (item) {
        item.notes = action.payload.notes;
      }
    },
    updateItemDate(state, action: PayloadAction<{ serviceId: number; specialistId?: number; scheduledDate: string }>) {
      const item = state.items.find(item => 
        item.service.id === action.payload.serviceId && 
        item.specialist?.id === action.payload.specialistId
      );
      if (item) {
        item.scheduledDate = action.payload.scheduledDate;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  decreaseQuantity, 
  updateItemNotes, 
  updateItemDate, 
  clearCart 
} = cartSlice.actions;
export default cartSlice.reducer;
