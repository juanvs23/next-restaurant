"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Products</h1>
      {loading ? (
        <p className="text-white2">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-black/50 border border-golden/20 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-golden">{p.name}</h3>
                <p className="text-white2 text-sm">{p.description}</p>
              </div>
              <span className="text-white font-bold">${p.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
