"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/libs/store/hooks";
import { hydrateCart } from "@/libs/store/slicers/cartSlicer";
import type { CartItem } from "@/libs/store/slicers/cartSlicer";
import { safeGetItem } from "@/utils/localStorage";

export default function CartHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = safeGetItem<CartItem[]>("cart");
    dispatch(hydrateCart(stored ?? []));
  }, [dispatch]);

  return null;
}
