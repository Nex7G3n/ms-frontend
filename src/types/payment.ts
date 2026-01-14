export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentMethod {
  id: string;
  type: 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA';
  name: string;
  description?: string;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  method: PaymentMethod['type'];
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  status: PaymentStatus;
}
