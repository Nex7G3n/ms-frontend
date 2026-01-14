import { Package, Truck, MapPin, CreditCard, Calendar } from 'lucide-react';
import type { Order } from '../../types/order';

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Orden {order.id}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        {order.trackingNumber && (
          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
            <p className="text-sm text-slate-400 mb-1">Número de Seguimiento</p>
            <p className="text-lg font-mono text-teal-400">{order.trackingNumber}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-teal-400" />
          Productos
        </h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex-1">
                <p className="text-white font-medium">{item.product.pieza.nombre}</p>
                <p className="text-sm text-slate-400">
                  {item.product.modelo.marca.nombre} {item.product.modelo.nombre}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">{item.product.codigoProducto}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Cantidad: {item.quantity}</p>
                <p className="text-white font-medium">S/ {item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal-400" />
          Dirección de Envío
        </h3>
        <div className="text-slate-300">
          <p className="font-medium">{order.shippingAddress.recipientName}</p>
          <p className="text-sm">{order.shippingAddress.street} {order.shippingAddress.number}</p>
          {order.shippingAddress.reference && (
            <p className="text-sm text-slate-400">Ref: {order.shippingAddress.reference}</p>
          )}
          <p className="text-sm">
            {typeof order.shippingAddress.district === 'object' && 'name' in order.shippingAddress.district
              ? order.shippingAddress.district.name
              : 'Lima'}
          </p>
          <p className="text-sm">Tel: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-teal-400" />
            Envío
          </h3>
          <p className="text-slate-300">
            {order.shippingMethod === 'ESTANDAR' && 'Envío Estándar'}
            {order.shippingMethod === 'EXPRESS' && 'Envío Express'}
            {order.shippingMethod === 'RECOGER_EN_TIENDA' && 'Recoger en Tienda'}
          </p>
          <p className="text-white font-medium mt-2">S/ {order.shippingCost.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-400" />
            Pago
          </h3>
          <p className="text-slate-300">
            {order.paymentMethod === 'TARJETA' && 'Tarjeta de Crédito/Débito'}
            {order.paymentMethod === 'EFECTIVO' && 'Efectivo'}
            {order.paymentMethod === 'TRANSFERENCIA' && 'Transferencia Bancaria'}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Resumen</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>S/ {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Envío</span>
            <span>S/ {order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>IGV (18%)</span>
            <span>S/ {order.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-700/50 pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>S/ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
