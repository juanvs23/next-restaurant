"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface Product {
  _id?: string;
  productId?: string;
  name: string;
  price: number;
}

interface ProductSearchProps {
  products: Product[];
  onSelect: (product: Product) => void;
  placeholder?: string;
}

export default function ProductSearch({ products, onSelect, placeholder = "Buscar producto..." }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { if (query.trim()) setOpen(true); }}
        className="h-8 text-xs"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p._id || p.productId || p.name}
              type="button"
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors flex justify-between"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelect(p);
                setQuery("");
                setOpen(false);
              }}
            >
              <span>{p.name}</span>
              <span className="text-muted-foreground">${p.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
