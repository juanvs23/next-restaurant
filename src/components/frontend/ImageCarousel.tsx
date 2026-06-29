"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

// ── Component ──

export default function ImageCarousel({
  images,
  productName,
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // No images fallback
  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-white2/5">
        <div className="flex flex-col items-center gap-2 text-white2/30">
          <ImageIcon className="h-16 w-16" />
          <span className="text-sm">Sin imagen disponible</span>
        </div>
      </div>
    );
  }

  const imageSrc = (idx: number) => images[idx];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="overflow-hidden rounded-lg border border-white2/10 bg-black2/60">
        <img
          src={imageSrc(selectedIndex)}
          alt={`${productName} - imagen ${selectedIndex + 1}`}
          className="aspect-square w-full object-cover transition-opacity duration-300"
          style={{
            viewTransitionName: "product-main-image",
          }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200",
                idx === selectedIndex
                  ? "border-golden opacity-100 ring-1 ring-golden/40"
                  : "border-transparent opacity-60 hover:opacity-90"
              )}
            >
              <img
                src={imageSrc(idx)}
                alt={`${productName} - miniatura ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
