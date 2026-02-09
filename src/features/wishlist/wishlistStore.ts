import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: number[]; // product IDs
  add: (productId: number) => void;
  remove: (productId: number) => void;
  toggle: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId) =>
        set((state) => ({
          items: state.items.includes(productId) ? state.items : [...state.items, productId],
        })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      toggle: (productId) => {
        const { items } = get();
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      isInWishlist: (productId) => get().items.includes(productId),
      clear: () => set({ items: [] }),
    }),
    { name: 'blueprint_wishlist' },
  ),
);
