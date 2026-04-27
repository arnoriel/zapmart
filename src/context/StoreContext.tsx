import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, Order, Product } from '../types';

interface StoreContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => string;
  getOrderStatus: (order: Order) => Order['status'];

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // UI
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function getStatusForOrder(order: Order): Order['status'] {
  const now = Date.now();
  const elapsed = now - order.createdAt;
  const day = 24 * 60 * 60 * 1000;

  if (elapsed >= day * 2) return 'done';
  if (elapsed >= day) return 'delivering';
  return 'packaging';
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('orders') || '[]');
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id &&
            item.selectedColor === color &&
            item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    showNotification(`${product.name} added to cart!`);
  }, [showNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const placeOrder = useCallback((orderData: Omit<Order, 'id' | 'items' | 'total' | 'status' | 'createdAt'>): string => {
    const id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const newOrder: Order = {
      id,
      items: [...cartItems],
      total: cartTotal,
      status: 'packaging',
      createdAt: Date.now(),
      ...orderData,
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return id;
  }, [cartItems, cartTotal, clearCart]);

  const getOrderStatus = useCallback((order: Order): Order['status'] => {
    return getStatusForOrder(order);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return (
    <StoreContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
      orders, placeOrder, getOrderStatus,
      wishlist, toggleWishlist, isWishlisted,
      isCartOpen, setIsCartOpen,
      notification, showNotification,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
