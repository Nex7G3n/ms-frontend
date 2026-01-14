import { Plus, Minus, Trash2, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleIncrease = () => {
    updateCartItem(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateCartItem(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const subtotal = product.precio * quantity;

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-xl p-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="h-10 w-10 text-slate-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 truncate">{product.pieza.nombre}</h3>
          <p className="text-sm text-slate-400 mb-2">
            {product.modelo.marca.nombre} {product.modelo.nombre}
          </p>
          <p className="text-xs text-slate-500 font-mono">{product.codigoProducto}</p>
        </div>

        {/* Price and Controls */}
        <div className="flex flex-col items-end gap-2">
          <p className="text-lg font-bold text-white">S/ {subtotal.toFixed(2)}</p>
          <p className="text-sm text-slate-400">S/ {product.precio.toFixed(2)} c/u</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleDecrease}
              className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-white font-medium">{quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
