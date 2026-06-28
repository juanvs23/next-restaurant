"use client";

import { useAppDispatch, useAppSelector } from "@/libs/store/hooks";
import { addItem, selectCartItems } from "@/libs/store/slicers/cartSlicer";
import { cn } from "@/lib/utils";

// ── Types ──

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    priceBs: number;
    image: string;
  };
}

// ── Component ──

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const inCart = items.find((i) => i.productId === product._id);
  const cartQty = inCart?.quantity ?? 0;

  const handleAdd = () => {
    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        priceBs: product.priceBs,
        quantity: 1,
        image: product.image,
        slug: product.slug,
      })
    );
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "w-full rounded-md py-3 text-base font-semibold transition-all duration-200",
        "bg-golden text-black2 hover:bg-golden2 active:scale-[0.98]"
      )}
    >
      {cartQty > 0
        ? `Agregar otro — En carrito: ${cartQty}`
        : "Agregar al carrito"}
    </button>
  );
}
