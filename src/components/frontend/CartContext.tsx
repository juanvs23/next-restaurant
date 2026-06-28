"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ── Types ──

interface CartContextValue {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
}

// ── Context ──

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ── Provider ──

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setCartOpen] = useState(false);

  const toggleCart = useCallback(() => {
    setCartOpen((prev) => !prev);
  }, []);

  return (
    <CartContext.Provider value={{ isCartOpen, setCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
