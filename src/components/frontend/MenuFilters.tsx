"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import SearchBar from "./SearchBar";
import CategorySlider from "./CategorySlider";

// ── Types ──

interface Category {
  _id: string;
  name: string;
}

interface MenuFiltersProps {
  categories: Category[];
  defaultSearch?: string;
  defaultCategory?: string;
}

// ── Component ──

export default function MenuFilters({
  categories,
  defaultSearch = "",
  defaultCategory,
}: MenuFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useCallback(
    (term: string) => {
      updateParams("search", term || undefined);
    },
    [updateParams]
  );

  const handleCategory = useCallback(
    (categoryId: string | undefined) => {
      updateParams("category", categoryId);
    },
    [updateParams]
  );

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SearchBar onSearch={handleSearch} defaultValue={defaultSearch} />
      <CategorySlider
        categories={categories}
        selectedCategory={defaultCategory}
        onSelect={handleCategory}
      />
    </div>
  );
}
