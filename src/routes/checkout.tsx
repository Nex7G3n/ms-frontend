import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopLayout from '../components/shop/ShopLayout';
import CheckoutForm from '../components/shop/CheckoutForm';
import CartSummary from '../components/shop/CartSummary';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { shippingService } from '../services/shippingService';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { refetch } = useOrders();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleCheckout = async (data: {
    shippingAddress: any;
    shippingMethod: any;
    paymentMethod: any;
  }) => {
    setLoading(true);

    try {
      // Calcular costo de envío (ya se calculó antes, pero lo recalculamos para asegurar)
      const calculatedShippingCost = shippingService.calculateShipping(
        data.shippingAddress,
        data.shippingMethod
      );

      // Crear items de orden
      const orderItems = cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.precio,
        subtotal: item.product.precio * item.quantity,
      }));

      // Crear orden
      const order = orderService.createOrder(user.id, {
        items: orderItems,
        shippingAddress: data.shippingAddress,
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
      });

      // Procesar pago
      setPaymentProcessing(true);
      const paymentResult = await paymentService.processPayment({
        orderId: order.id,
        amount: order.total,
        method: data.paymentMethod,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      // Actualizar estado de orden
      orderService.updateOrderStatus(user.id, order.id, 'PROCESANDO');

      // Limpiar carrito
      clearCart();

      // Refrescar órdenes
      refetch();

      // Redirigir a confirmación
      navigate(`/orders/${order.id}?success=true`);
    } catch (error: any) {
      alert(error.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const [shippingCost, setShippingCost] = useState(15); // Default

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        {paymentProcessing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 text-center">
              <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Procesando pago...</p>
              <p className="text-slate-400 mt-2">Por favor espera</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm 
              onSubmit={handleCheckout} 
              loading={loading}
              onShippingMethodChange={(method) => {
                const cost = shippingService.calculateShipping({ district: { idDistrict: 1, name: 'Lima', province: { idProvince: 1, name: 'Lima', department: { idDepartment: 1, name: 'Lima' } } } } as any, method);
                setShippingCost(cost);
              }}
            />
          </div>
          <div>
            <CartSummary shippingCost={shippingCost} showCheckoutButton={false} />
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
