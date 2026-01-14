import type { Address } from '../types/models';
import type { Order } from '../types/order';

export const shippingService = {
  // Calcular costo de envío basado en dirección
  calculateShipping(address: Address, method: Order['shippingMethod']): number {
    // Simular cálculo basado en distancia del distrito
    // En una implementación real, esto consultaría una API de envíos
    
    const baseCosts = {
      'ESTANDAR': 15.00,
      'EXPRESS': 25.00,
      'RECOGER_EN_TIENDA': 0,
    };

    if (method === 'RECOGER_EN_TIENDA') {
      return 0;
    }

    let cost = baseCosts[method] || 15.00;

    // Simular costo adicional por distancia (basado en nombre del distrito)
    const districtName = typeof address.district === 'object' && 'name' in address.district
      ? address.district.name.toLowerCase()
      : '';

    // Distritos "lejanos" tienen costo adicional
    const farDistricts = ['callao', 'comas', 'san juan de lurigancho', 'villa el salvador'];
    if (farDistricts.some(d => districtName.includes(d))) {
      cost += 5.00;
    }

    return cost;
  },

  // Obtener métodos de envío disponibles
  getShippingMethods() {
    return [
      {
        id: 'standard',
        type: 'ESTANDAR' as const,
        name: 'Envío Estándar',
        description: '5-7 días hábiles',
        estimatedDays: '5-7',
      },
      {
        id: 'express',
        type: 'EXPRESS' as const,
        name: 'Envío Express',
        description: '2-3 días hábiles',
        estimatedDays: '2-3',
      },
      {
        id: 'pickup',
        type: 'RECOGER_EN_TIENDA' as const,
        name: 'Recoger en Tienda',
        description: 'Sin costo de envío',
        estimatedDays: 'Inmediato',
      },
    ];
  },

  // Generar número de seguimiento
  generateTrackingNumber(): string {
    return `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  },
};
