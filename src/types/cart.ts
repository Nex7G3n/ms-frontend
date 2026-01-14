import type { Autoparte } from './models';

export interface CartItem {
  product: Autoparte;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
