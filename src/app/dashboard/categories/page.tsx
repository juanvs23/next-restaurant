"use client";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Categories</h1>
      {loading ? (
        <p className="text-white2">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {categories.map((c) => (
            <div key={c._id} className="bg-black/50 border border-golden/20 rounded-lg p-4">
              <h3 className="text-golden">{c.name}</h3>
              <p className="text-white2 text-sm">{c.description}</p>
              <span className="text-white2 text-xs">{c.items?.length || 0} products</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
