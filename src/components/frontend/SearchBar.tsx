"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// ── Types ──

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

// ── Component ──

export default function SearchBar({
  onSearch,
  placeholder = "Buscar en el menú...",
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Sync internal state with prop changes (e.g., browser back/forward)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Debounce: sync value → callback after 300ms of inactivity
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearchRef.current(value);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white2/40" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "w-full rounded-full border border-white2/20 bg-black2/60 py-2.5 pl-10 pr-10",
          "text-sm text-white2 placeholder:text-white2/30",
          "focus:border-golden/50 focus:outline-none focus:ring-1 focus:ring-golden/30",
          "transition-colors"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white2/40 hover:text-white2 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
