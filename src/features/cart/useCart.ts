import { useCartStore } from './cartStore';
import type { CartTotals } from '@/types/cart';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const totalCount = useCartStore((state) => state.totalCount);

  const totals: CartTotals = items.reduce(
    (acc, item) => {
      if (item.billing === 'monthly') {
        acc.monthlyTotal += item.price * item.quantity;
      } else {
        acc.annualTotal += item.price * item.quantity;
      }
      acc.itemCount += item.quantity;
      return acc;
    },
    { monthlyTotal: 0, annualTotal: 0, itemCount: 0 }
  );

  return {
    items,
    add,
    remove,
    clear,
    totalCount,
    totals,
  };
}
