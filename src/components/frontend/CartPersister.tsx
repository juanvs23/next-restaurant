"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/libs/store/hooks";
import { selectCartItems } from "@/libs/store/slicers/cartSlicer";
import { safeSetItem } from "@/utils/localStorage";

/**
 * Watches cart items and persists to localStorage on every change.
 * Renders nothing — purely a side-effect component.
 */
export default function CartPersister() {
  const items = useAppSelector(selectCartItems);
  const hydrated = useRef(false);

  useEffect(() => {
    // Skip the first render (hydration already loaded from localStorage)
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    safeSetItem("cart", items);
  }, [items]);

  return null;
}
