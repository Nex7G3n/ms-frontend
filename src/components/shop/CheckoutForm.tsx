import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { ShippingAddress, Order } from '../../types/order';
import type { District } from '../../types/models';

interface CheckoutFormProps {
  onSubmit: (data: {
    shippingAddress: ShippingAddress;
    shippingMethod: Order['shippingMethod'];
    paymentMethod: Order['paymentMethod'];
  }) => void;
  loading?: boolean;
}

export default function CheckoutForm({ onSubmit, loading, onShippingMethodChange }: CheckoutFormProps) {
  const { user } = useAuth();
  const [shippingMethod, setShippingMethod] = useState<Order['shippingMethod']>('ESTANDAR');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('TARJETA');
  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    recipientName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    street: '',
    number: '',
    reference: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.phone || !formData.street || !formData.number) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Crear dirección de envío (simplificado, en producción necesitarías seleccionar distrito)
    const shippingAddress: ShippingAddress = {
      idAddress: Date.now(),
      recipientName: formData.recipientName!,
      phone: formData.phone!,
      street: formData.street!,
      number: formData.number!,
      reference: formData.reference,
      district: {
        idDistrict: 1,
        name: 'Lima',
        province: {
          idProvince: 1,
          name: 'Lima',
          department: {
            idDepartment: 1,
            name: 'Lima',
          },
        },
      },
    };

    onSubmit({
      shippingAddress,
      shippingMethod,
      paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Dirección de Envío</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Teléfono *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Dirección *</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="Calle, Avenida, etc."
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Número *</label>
            <input
              type="text"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Referencia</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Opcional"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Método de Envío</h2>
        <div className="space-y-3">
          {(['ESTANDAR', 'EXPRESS', 'RECOGER_EN_TIENDA'] as const).map((method) => (
            <label
              key={method}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                shippingMethod === method
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method}
                checked={shippingMethod === method}
                onChange={(e) => {
                  const newMethod = e.target.value as Order['shippingMethod'];
                  setShippingMethod(newMethod);
                  onShippingMethodChange?.(newMethod);
                }}
                className="w-4 h-4 text-teal-500"
              />
              <div className="flex-1">
                <p className="text-white font-medium">
                  {method === 'ESTANDAR' && 'Envío Estándar (5-7 días)'}
                  {method === 'EXPRESS' && 'Envío Express (2-3 días)'}
                  {method === 'RECOGER_EN_TIENDA' && 'Recoger en Tienda'}
                </p>
                <p className="text-sm text-slate-400">
                  {method === 'ESTANDAR' && 'S/ 15.00'}
                  {method === 'EXPRESS' && 'S/ 25.00'}
                  {method === 'RECOGER_EN_TIENDA' && 'Gratis'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Método de Pago</h2>
        <div className="space-y-3">
          {(['TARJETA', 'EFECTIVO', 'TRANSFERENCIA'] as const).map((method) => (
            <label
              key={method}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === method
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value as Order['paymentMethod'])}
                className="w-4 h-4 text-teal-500"
              />
              <div>
                <p className="text-white font-medium">
                  {method === 'TARJETA' && 'Tarjeta de Crédito/Débito'}
                  {method === 'EFECTIVO' && 'Efectivo'}
                  {method === 'TRANSFERENCIA' && 'Transferencia Bancaria'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  );
}
