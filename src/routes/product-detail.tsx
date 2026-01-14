import { useParams, Navigate } from 'react-router-dom';
import ShopLayout from '../components/shop/ShopLayout';
import ProductDetail from '../components/shop/ProductDetail';
import { useAutopartes } from '../hooks/useAutoPartes';
import { Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { autopartes, loading } = useAutopartes();

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          <p className="text-slate-400">Cargando producto...</p>
        </div>
      </ShopLayout>
    );
  }

  const product = autopartes.find((p) => p.id === Number(id));

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail product={product} />
      </div>
    </ShopLayout>
  );
}
