import type { Autoparte } from '../types/models';
import type { Cart, CartItem, CartSummary } from '../types/cart';

const CART_STORAGE_KEY = (userId: number) => `cart_${userId}`;
const GUEST_CART_KEY = 'guest_cart';

export const cartService = {
  // Obtener carrito del usuario o carrito de invitado
  getCart(userId?: number | null): Cart {
    const key = userId ? CART_STORAGE_KEY(userId) : GUEST_CART_KEY;
    const cartJson = localStorage.getItem(key);
    
    if (cartJson) {
      try {
        return JSON.parse(cartJson);
      } catch {
        return { items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      }
    }
    
    return { items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },

  // Agregar producto al carrito
  addToCart(product: Autoparte, quantity: number = 1, userId?: number | null): Cart {
    const cart = this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Si ya existe, actualizar cantidad
      cart.items[existingItemIndex].quantity += quantity;
      // Validar stock
      if (cart.items[existingItemIndex].quantity > product.stock) {
        cart.items[existingItemIndex].quantity = product.stock;
      }
    } else {
      // Si no existe, agregar nuevo item
      if (quantity > product.stock) {
        quantity = product.stock;
      }
      cart.items.push({ product, quantity });
    }

    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart, userId);
    return cart;
  },

  // Actualizar cantidad de un item
  updateCartItem(productId: number, quantity: number, userId?: number | null): Cart {
    const cart = this.getCart(userId);
    const itemIndex = cart.items.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const maxQuantity = cart.items[itemIndex].product.stock;
        cart.items[itemIndex].quantity = Math.min(quantity, maxQuantity);
      }
      cart.updatedAt = new Date().toISOString();
      this.saveCart(cart, userId);
    }

    return cart;
  },

  // Eliminar producto del carrito
  removeFromCart(productId: number, userId?: number | null): Cart {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(item => item.product.id !== productId);
    cart.updatedAt = new Date().toISOString();
    this.saveCart(cart, userId);
    return cart;
  },

  // Vaciar carrito
  clearCart(userId?: number | null): void {
    const key = userId ? CART_STORAGE_KEY(userId) : GUEST_CART_KEY;
    localStorage.removeItem(key);
  },

  // Guardar carrito
  saveCart(cart: Cart, userId?: number | null): void {
    const key = userId ? CART_STORAGE_KEY(userId) : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  },

  // Migrar carrito de invitado a usuario
  migrateGuestCart(userId: number): Cart {
    const guestCart = this.getCart(null);
    const userCart = this.getCart(userId);

    // Combinar items
    guestCart.items.forEach(guestItem => {
      const existingItem = userCart.items.find(item => item.product.id === guestItem.product.id);
      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + guestItem.quantity,
          guestItem.product.stock
        );
      } else {
        userCart.items.push(guestItem);
      }
    });

    userCart.updatedAt = new Date().toISOString();
    this.saveCart(userCart, userId);
    this.clearCart(null); // Limpiar carrito de invitado
    return userCart;
  },

  // Calcular totales
  getCartSummary(cart: Cart, shippingCost: number = 0): CartSummary {
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.precio * item.quantity);
    }, 0);

    const tax = subtotal * 0.18; // IGV 18%
    const total = subtotal + shippingCost + tax;

    return {
      subtotal,
      shipping: shippingCost,
      tax,
      total,
    };
  },

  // Obtener cantidad total de items
  getTotalItems(cart: Cart): number {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },
};
