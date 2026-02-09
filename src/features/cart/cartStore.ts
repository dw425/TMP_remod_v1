import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';
import { trackEvent } from '@/features/analytics/analytics';

interface CartStore {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  clear: () => void;
  totalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id && i.billing === item.billing);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.billing === item.billing ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
        trackEvent('cart_item_added', { productId: item.id, title: item.title, price: item.price, billing: item.billing });
      },
      remove: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
        trackEvent('cart_item_removed', { productId: id });
      },
      clear: () => {
        const itemCount = get().items.length;
        set({ items: [] });
        trackEvent('checkout_completed', { itemCount });
      },
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'blueprint_cart_v2' }
  )
);
