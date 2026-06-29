"use client";
import { useState, useRef, useCallback } from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Text input with VES currency formatting.
 * Stores raw numeric string, displays with thousand separators.
 */
export default function CurrencyInput({ value, onChange, placeholder, className }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const formatDisplay = (raw: string): string => {
    const num = parseFloat(raw);
    if (isNaN(num)) return raw || "";
    return num.toLocaleString("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Remove all dots (thousands separator in VE format)
    raw = raw.replace(/\./g, "");
    // Replace comma with dot (decimal separator)
    raw = raw.replace(/,/g, ".");
    // Remove any non-numeric chars except dot
    raw = raw.replace(/[^0-9.]/g, "");
    // Only keep first dot
    const dotIdx = raw.indexOf(".");
    if (dotIdx >= 0) {
      raw = raw.substring(0, dotIdx + 1) + raw.substring(dotIdx + 1).replace(/\./g, "");
    }
    onChange(raw);
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={focused ? (value || "") : formatDisplay(value)}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className={`flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    />
  );
}

