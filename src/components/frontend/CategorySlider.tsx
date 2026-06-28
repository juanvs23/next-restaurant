"use client";

import { cn } from "@/lib/utils";

// ── Types ──

interface Category {
  _id: string;
  name: string;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect: (categoryId: string | undefined) => void;
}

// ── Component ──

export default function CategorySlider({
  categories,
  selectedCategory,
  onSelect,
}: CategorySliderProps) {
  return (
    <div className="overflow-x-auto scroll-smooth scrollbar-none">
      <div
        className="flex gap-2 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {/* "All" pill */}
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={cn(
            "flex-shrink-0 scroll-ml-4 rounded-full px-5 py-2 text-sm font-medium transition-colors",
            "scroll-snap-align-start",
            !selectedCategory
              ? "bg-golden text-black2"
              : "bg-white2/10 text-white2 hover:bg-white2/20"
          )}
        >
          Todas
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelect(cat._id)}
            className={cn(
              "flex-shrink-0 scroll-ml-4 rounded-full px-5 py-2 text-sm font-medium transition-colors",
              "scroll-snap-align-start",
              selectedCategory === cat._id
                ? "bg-golden text-black2"
                : "bg-white2/10 text-white2 hover:bg-white2/20"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
