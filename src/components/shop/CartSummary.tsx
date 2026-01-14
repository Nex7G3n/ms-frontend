import { ShoppingBag, Truck, Receipt } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';

interface CartSummaryProps {
  shippingCost?: number;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export default function CartSummary({ shippingCost = 0, onCheckout, showCheckoutButton = true }: CartSummaryProps) {
  const { cartSummary, cart } = useCart();

  const finalSummary = {
    ...cartSummary,
    shipping: shippingCost,
    total: cartSummary.subtotal + shippingCost + cartSummary.tax,
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-teal-400" />
        Resumen del Pedido
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span>S/ {finalSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Envío
          </span>
          <span>{shippingCost > 0 ? `S/ ${shippingCost.toFixed(2)}` : 'Gratis'}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            IGV (18%)
          </span>
          <span>S/ {finalSummary.tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span>S/ {finalSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {cart.items.length > 0 && showCheckoutButton && (
        <Link
          to="/checkout"
          onClick={onCheckout}
          className="w-full block text-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-teal-500/25"
        >
          Proceder al Checkout
        </Link>
      )}
    </div>
  );
}
