"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard, ResponsiveGrid } from "@/components/frontend";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceBs: number;
  images: string[];
  description: string;
  categoryName?: string;
}

interface Props {
  products: Product[];
  batchSize?: number;
}

export default function ProductGrid({ products, batchSize = 12 }: Props) {
  const [visible, setVisible] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visible >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((prev) => Math.min(prev + batchSize, products.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visible, products.length, batchSize]);

  const visibleProducts = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <>
      <ResponsiveGrid>
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ResponsiveGrid>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex justify-center py-8"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-golden border-t-transparent" />
        </div>
      )}
    </>
  );
}
