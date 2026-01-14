import type { PaymentData, PaymentResult, PaymentStatus } from '../types/payment';

export const paymentService = {
  // Simular procesamiento de pago
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Simular éxito/fallo aleatorio (90% éxito para demo)
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Pago procesado exitosamente',
        status: 'COMPLETED',
      };
    } else {
      return {
        success: false,
        message: 'Error al procesar el pago. Por favor, intente nuevamente.',
        status: 'FAILED',
      };
    }
  },

  // Obtener métodos de pago disponibles
  getAvailablePaymentMethods() {
    return [
      {
        id: 'card',
        type: 'TARJETA' as const,
        name: 'Tarjeta de Crédito/Débito',
        description: 'Visa, Mastercard, Amex',
      },
      {
        id: 'cash',
        type: 'EFECTIVO' as const,
        name: 'Efectivo',
        description: 'Pago al recibir',
      },
      {
        id: 'transfer',
        type: 'TRANSFERENCIA' as const,
        name: 'Transferencia Bancaria',
        description: 'Transferencia interbancaria',
      },
    ];
  },
};
