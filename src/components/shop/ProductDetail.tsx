import { useState } from 'react';
import { ShoppingCart, Package, Car, Wrench, DollarSign, Layers } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Autoparte } from '../../types/models';

interface ProductDetailProps {
  product: Autoparte;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    addToCart(product, quantity);
    // Reset quantity
    setQuantity(1);
  };

  const isAvailable = product.stock > 0 && product.estado === 'DISPONIBLE';
  const maxQuantity = Math.min(quantity, product.stock);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <Package className="h-32 w-32 text-slate-600" />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.pieza.nombre}</h1>
            <p className="text-lg text-slate-400">
              {product.modelo.marca.nombre} {product.modelo.nombre} ({product.modelo.anio})
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400">Precio</p>
                <p className="text-3xl font-bold text-white">S/ {product.precio.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Stock</p>
                <p className={`text-xl font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {product.stock} unidades
                </p>
              </div>
            </div>

            {isAvailable ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center bg-slate-700/50 border border-slate-600/50 rounded-lg text-white py-2"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all font-medium shadow-lg shadow-teal-500/25"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
                Producto no disponible
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Especificaciones</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-5 w-5 text-teal-400" />
                  <p className="text-sm text-slate-400">Marca</p>
                </div>
                <p className="text-white font-medium">{product.modelo.marca.nombre}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-teal-400" />
                  <p className="text-sm text-slate-400">Código</p>
                </div>
                <p className="text-white font-mono">{product.codigoProducto}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-teal-400" />
                  <p className="text-sm text-slate-400">Categoría</p>
                </div>
                <p className="text-white font-medium">{product.pieza.categoria}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-teal-400" />
                  <p className="text-sm text-slate-400">Estado</p>
                </div>
                <p className="text-white font-medium">{product.estado}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.pieza.descripcion && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Descripción</h2>
              <p className="text-slate-300">{product.pieza.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
