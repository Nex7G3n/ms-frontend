import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import type { Order } from '../../types/order';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      PENDIENTE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      PROCESANDO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      ENVIADO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      ENTREGADO: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      CANCELADO: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.PENDIENTE;
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      PENDIENTE: 'Pendiente',
      PROCESANDO: 'Procesando',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">Orden {order.id}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(order.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              S/ {order.total.toFixed(2)}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
        </p>
        <div className="flex items-center gap-2 text-teal-400">
          <span className="text-sm font-medium">Ver detalles</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
