"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAppDispatch } from "@/libs/store/hooks";
import { addItem } from "@/libs/store/slicers/cartSlicer";
import { formatVes } from "@/libs/currency";
import { safeSetItem } from "@/utils/localStorage";
import { useAppSelector } from "@/libs/store/hooks";
import { selectCartItems } from "@/libs/store/slicers/cartSlicer";
import { cn } from "@/lib/utils";

// ── Types ──

interface ProductCardProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceBs: number;
  images?: string[];
  description?: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

// ── Component ──

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const firstImage = product.images?.[0];
  const imageSrc = firstImage
    ? `/uploads/food/${firstImage}`
    : undefined;

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
        image: firstImage ?? "",
        slug: product.slug,
      })
    );
  };

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-white2/10",
        "bg-black2/60 shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:border-golden/30"
      )}
    >
      {/* Image */}
      <Link
        href={`/menu/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white2/5">
            <ImageIcon className="h-10 w-10 text-white2/20" />
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/menu/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-golden transition-colors group-hover:text-golden2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-white2/60 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-white2">
            {formatVes(product.priceBs)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-200",
              "bg-golden text-black2 hover:bg-golden2 active:scale-95"
            )}
          >
            {cartQty > 0 ? `Agregado (${cartQty})` : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
