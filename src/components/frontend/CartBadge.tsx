"use client";

import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/libs/store/hooks";
import { selectCartCount } from "@/libs/store/slicers/cartSlicer";
import { useCart } from "./CartContext";

export default function CartBadge() {
  const count = useAppSelector(selectCartCount);
  const { toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative flex items-center gap-1 text-white2 hover:text-golden transition-colors"
      aria-label={`Carrito con ${count} producto${count !== 1 ? "s" : ""}`}
    >
      <ShoppingCart className="h-6 w-6" />

      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 300 }}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-golden text-xs font-bold text-black2"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
