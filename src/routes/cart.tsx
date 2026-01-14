import { Link } from 'react-router-dom';
import ShopLayout from '../components/shop/ShopLayout';
import CartItem from '../components/shop/CartItem';
import CartSummary from '../components/shop/CartSummary';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Cart() {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-teal-400" />
          Mi Carrito
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400 mb-4">Tu carrito está vacío</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <CartItem key={`${item.product.id}-${index}`} item={item} />
              ))}
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
