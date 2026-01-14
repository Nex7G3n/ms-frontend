import type { Order, CreateOrderDTO, OrderStatus } from '../types/order';

const ORDERS_STORAGE_KEY = (userId: number) => `orders_${userId}`;

export const orderService = {
  // Crear nueva orden
  createOrder(userId: number, orderData: CreateOrderDTO): Order {
    const orders = this.getOrders(userId);
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.items.reduce((sum, item) => sum + item.subtotal, 0),
      shippingCost: 0, // Se calculará después
      tax: 0, // Se calculará después
      total: 0, // Se calculará después
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calcular totales
    const tax = newOrder.subtotal * 0.18; // IGV 18%
    const shippingCost = this.calculateShippingCost(newOrder.shippingMethod);
    newOrder.shippingCost = shippingCost;
    newOrder.tax = tax;
    newOrder.total = newOrder.subtotal + shippingCost + tax;

    orders.push(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY(userId), JSON.stringify(orders));

    return newOrder;
  },

  // Obtener todas las órdenes del usuario
  getOrders(userId: number): Order[] {
    const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY(userId));
    if (!ordersJson) return [];
    
    try {
      return JSON.parse(ordersJson);
    } catch {
      return [];
    }
  },

  // Obtener orden por ID
  getOrderById(userId: number, orderId: string): Order | null {
    const orders = this.getOrders(userId);
    return orders.find(o => o.id === orderId) || null;
  },

  // Actualizar estado de orden
  updateOrderStatus(userId: number, orderId: string, status: OrderStatus): Order {
    const orders = this.getOrders(userId);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      throw new Error('Orden no encontrada');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Generar tracking number cuando se envía
    if (status === 'ENVIADO' && !orders[orderIndex].trackingNumber) {
      orders[orderIndex].trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    localStorage.setItem(ORDERS_STORAGE_KEY(userId), JSON.stringify(orders));
    return orders[orderIndex];
  },

  // Calcular costo de envío
  calculateShippingCost(method: Order['shippingMethod']): number {
    const costs = {
      'ESTANDAR': 15.00,
      'EXPRESS': 25.00,
      'RECOGER_EN_TIENDA': 0,
    };
    return costs[method] || 15.00;
  },

  // Obtener órdenes por estado
  getOrdersByStatus(userId: number, status: OrderStatus): Order[] {
    return this.getOrders(userId).filter(o => o.status === status);
  },
};
