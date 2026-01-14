import { useParams, Navigate } from 'react-router-dom';
import ShopLayout from '../components/shop/ShopLayout';
import OrderSummary from '../components/shop/OrderSummary';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { Navigate as NavigateComponent } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getOrderById } = useOrders();
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success') === 'true';

  if (!user) {
    return <NavigateComponent to="/login" replace />;
  }

  if (!id) {
    return <NavigateComponent to="/orders" replace />;
  }

  const order = getOrderById(id);

  if (!order) {
    return <NavigateComponent to="/orders" replace />;
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-emerald-400">¡Pedido realizado exitosamente!</p>
          </div>
        )}
        <OrderSummary order={order} />
      </div>
    </ShopLayout>
  );
}
