"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveGrid({
  children,
  className,
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {Array.isArray(children)
        ? React.Children.toArray(children).map((child, i) => (
            <div
              key={child.key ?? i}
              data-aos="fade-up"
              data-aos-duration="400"
              data-aos-delay={i * 50}
              data-aos-easing="ease-out"
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
