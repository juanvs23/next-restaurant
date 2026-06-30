"use client";

import { useEffect, useState } from "react";

interface MediaImage {
  _id: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  description: string;
  width?: number;
  height?: number;
}

interface UseMediaOptions {
  categories?: string[];
  limit?: number;
}

interface UseMediaResult {
  images: MediaImage[];
  loading: boolean;
  error: string | null;
}

export function useMedia({ categories, limit = 20 }: UseMediaOptions = {}): UseMediaResult {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categories?.length) {
      categories.forEach((c) => params.append("category", c));
    }
    params.set("limit", String(limit));

    fetch(`/api/frontend/media?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch media");
        return r.json();
      })
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [categories?.join(","), limit]);

  return { images, loading, error };
}
