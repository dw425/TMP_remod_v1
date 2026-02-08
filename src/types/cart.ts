import type { Product } from './product';

export interface CartItem {
  id: number;
  title: string;
  type: Product['type'];
  billing: 'monthly' | 'annual';
  price: number;
  quantity: number;
}

export interface CartTotals {
  monthlyTotal: number;
  annualTotal: number;
  itemCount: number;
}
