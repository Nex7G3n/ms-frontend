import type { Autoparte } from './models';
import type { Address } from './models';

export type OrderStatus = 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export type PaymentMethod = 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA';

export type ShippingMethod = 'ESTANDAR' | 'EXPRESS' | 'RECOGER_EN_TIENDA';

export interface OrderItem {
  product: Autoparte;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress extends Address {
  recipientName: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface CreateOrderDTO {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}
