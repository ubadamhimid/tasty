import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CartItem } from '../types';
import { isShopClosedToday, CLOSED_TEXT } from '../utils/openingHours';

const CART_STORAGE_KEY = 'tasty_cart_v1';
const MAX_QTY_PER_ITEM = 20;

interface CartToast {
  id: number;
  message: string;
  kind: 'added' | 'closed';
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isClosed: boolean;
  toast: CartToast | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const loadStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);
  const [isClosed, setIsClosed] = useState<boolean>(() => isShopClosedToday());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist the cart so a page refresh doesn't lose the customer's order
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) - cart still works in memory */
    }
  }, [items]);

  // Re-check once a minute so the page flips at midnight without a refresh
  useEffect(() => {
    const timer = setInterval(() => setIsClosed(isShopClosedToday()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const showToast = useCallback((message: string, kind: CartToast['kind'] = 'added') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, kind });
    toastTimer.current = setTimeout(() => setToast(null), kind === 'closed' ? 4500 : 2600);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const addItem = useCallback<CartContextValue['addItem']>((item, quantity = 1) => {
    if (isClosed) {
      showToast(CLOSED_TEXT, 'closed');
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: Math.min(MAX_QTY_PER_ITEM, i.quantity + quantity) } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(MAX_QTY_PER_ITEM, quantity) }];
    });
    showToast(`${item.name} added to your order`);
  }, [showToast, isClosed]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY_PER_ITEM, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      itemCount,
      subtotal,
      isOpen,
      isClosed,
      toast,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      dismissToast,
    };
  }, [items, isOpen, isClosed, toast, openCart, closeCart, addItem, updateQuantity, removeItem, clearCart, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
