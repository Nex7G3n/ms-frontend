import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';
import type { Cart, CartItem, CartSummary } from '../types/cart';
import type { Autoparte } from '../types/models';

interface CartContextType {
  cart: Cart;
  cartSummary: CartSummary;
  totalItems: number;
  addToCart: (product: Autoparte, quantity?: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
  setShippingCost: (cost: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const [shippingCost, setShippingCost] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  // Obtener userId del localStorage
  useEffect(() => {
    const updateUserId = () => {
      const sessionJson = localStorage.getItem('userSession');
      if (sessionJson) {
        try {
          const session = JSON.parse(sessionJson);
          setUserId(session.user?.id || null);
        } catch {
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
    };

    updateUserId();

    // Escuchar cambios en localStorage (incluyendo eventos personalizados)
    const handleStorageChange = () => {
      updateUserId();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userSessionChange', handleStorageChange);
    
    // Polling para detectar cambios (fallback)
    const interval = setInterval(updateUserId, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userSessionChange', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadCart = () => {
    const loadedCart = cartService.getCart(userId);
    setCart(loadedCart);
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const addToCart = (product: Autoparte, quantity: number = 1) => {
    const updatedCart = cartService.addToCart(product, quantity, userId);
    setCart(updatedCart);
  };

  const updateCartItem = (productId: number, quantity: number) => {
    const updatedCart = cartService.updateCartItem(productId, quantity, userId);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartService.removeFromCart(productId, userId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    cartService.clearCart(userId);
    loadCart();
  };

  const refreshCart = () => {
    loadCart();
  };

  const cartSummary = cartService.getCartSummary(cart, shippingCost);
  const totalItems = cartService.getTotalItems(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartSummary,
        totalItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
        setShippingCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
