import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import type { Autoparte } from '../../types/models';

interface ProductCardProps {
  product: Autoparte;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      window.location.href = '/login';
      return;
    }

    addToCart(product, 1);
  };

  const isAvailable = product.stock > 0 && product.estado === 'DISPONIBLE';

  return (
    <Link
      to={`/shop/product/${product.id}`}
      className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
    >
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center relative overflow-hidden">
        <Package className="h-16 w-16 text-slate-600 group-hover:text-teal-500/50 transition-colors" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-red-500/80 text-white text-sm font-medium rounded-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
            {product.pieza.nombre}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {product.modelo.marca.nombre} {product.modelo.nombre}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-500">Código</p>
            <p className="text-sm font-mono text-slate-300">{product.codigoProducto}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Stock</p>
            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {product.stock} unidades
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div>
            <p className="text-xs text-slate-500">Precio</p>
            <p className="text-xl font-bold text-white">S/ {product.precio.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              isAvailable
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/25'
                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
