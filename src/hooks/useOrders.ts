import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from './useAuth';
import type { Order, OrderStatus } from '../types/order';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const loadOrders = () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const userOrders = orderService.getOrders(user.id);
      setOrders(userOrders);
    } catch (err: any) {
      setError(err.message || 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId: string): Order | null => {
    if (!user) return null;
    return orderService.getOrderById(user.id, orderId);
  };

  const getOrdersByStatus = (status: OrderStatus): Order[] => {
    if (!user) return [];
    return orderService.getOrdersByStatus(user.id, status);
  };

  return {
    orders,
    loading,
    error,
    refetch: loadOrders,
    getOrderById,
    getOrdersByStatus,
  };
}
