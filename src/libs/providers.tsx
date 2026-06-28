"use client";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./store/storeProvider";
import { CartProvider } from "@/components/frontend/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SessionProvider>
        <CartProvider>{children}</CartProvider>
      </SessionProvider>
    </StoreProvider>
  );
}
