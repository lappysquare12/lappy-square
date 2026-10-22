'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice: number;
  image: string;
  conditionGrade: string;
  ramGb: number;
  storageGb: number;
  processor: string;
  quantity: number;
  stock: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  minOrderValue: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  coupon: AppliedCoupon | null;
  couponError: string | null;
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lappy_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('lappy_coupon');
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lappy_cart', JSON.stringify(items));
    } catch {
      // Storage quota or private mode
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (coupon) {
        localStorage.setItem('lappy_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('lappy_coupon');
      }
    } catch {
      // Ignore
    }
  }, [coupon, isLoaded]);

  const addToCart = (product: Omit<CartItem, 'quantity' | 'id'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map((i) =>
          i.productId === product.productId ? { ...i, quantity: newQty } : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          id: `${product.productId}-${Date.now()}`,
          quantity: Math.min(qty, product.stock),
        },
      ];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(qty, item.stock) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recalculate coupon discount
  let discountAmount = 0;
  if (coupon) {
    if (subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discountAmount = coupon.discountValue;
      }
    } else {
      // Order subtotal fell below min order value
      discountAmount = 0;
    }
  }

  const shippingCharge = 0; // Free Insured Shipping pan India
  const taxAmount = 0; // Tax included in INR pricing as per Indian retail standards
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge);

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon code');
        return false;
      }

      setCoupon({
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        discountAmount: data.discountAmount,
        minOrderValue: data.coupon.minOrderValue,
      });
      return true;
    } catch {
      setCouponError('Failed to validate coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingCharge,
        taxAmount,
        totalAmount,
        coupon,
        couponError,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
