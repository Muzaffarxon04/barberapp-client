// Cart Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateCartItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },
      getTotalDuration: () => {
        return get().items.reduce((total, item) => total + item.duration, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
