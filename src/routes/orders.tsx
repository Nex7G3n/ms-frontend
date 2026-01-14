import { useState } from 'react';
import ShopLayout from '../components/shop/ShopLayout';
import OrderCard from '../components/shop/OrderCard';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import type { OrderStatus } from '../types/order';

export default function Orders() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const statusOptions: Array<OrderStatus | 'ALL'> = ['ALL', 'PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          <Package className="h-8 w-8 text-teal-400" />
          Mis Órdenes
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {status === 'ALL' ? 'Todas' : status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
            <p className="text-slate-400">Cargando órdenes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No tienes órdenes aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
