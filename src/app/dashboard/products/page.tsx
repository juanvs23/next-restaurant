"use client";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: { _id: string; name: string } | string;
  type: string;
  ingredients: string[];
  images: string[];
  SKU: string;
  available: boolean;
}

interface Category {
  _id: string;
  name: string;
}

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  type: "food",
  ingredients: "",
  images: [""] as string[],
  SKU: "",
  available: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchData = () => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([products, categories]) => {
      setProducts(products);
      setCategories(categories);
      setLoading(false);
    });
  };

  useEffect(fetchData, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      categoryId: typeof p.categoryId === "string" ? p.categoryId : p.categoryId._id,
      type: p.type,
      ingredients: (p.ingredients || []).join(", "),
      images: p.images?.length ? p.images : [""],
      SKU: p.SKU || "",
      available: p.available,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      type: form.type,
      ingredients: form.ingredients.split(",").map((s: string) => s.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
      SKU: form.SKU,
      available: form.available,
    };

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageField = (i: number) => setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) });
  const setImage = (i: number, v: string) => {
    const imgs = [...form.images];
    imgs[i] = v;
    setForm({ ...form, images: imgs });
  };

  if (loading) return <p className="text-white2">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white">Products</h1>
        <button onClick={openCreate} className="button">+ Add Product</button>
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4">
          <div className="bg-black2 border border-golden/30 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-xl text-golden">{editingId ? "Edit" : "New"} Product</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-white2 text-sm">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-white" />
              </div>
              <div className="col-span-2">
                <label className="text-white2 text-sm">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-white" rows={2} />
              </div>
              <div>
                <label className="text-white2 text-sm">Price ($)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-white2 text-sm">SKU</label>
                <input value={form.SKU} onChange={(e) => setForm({ ...form, SKU: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-white2 text-sm">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-golden">
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white2 text-sm">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-golden">
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-white2 text-sm">Ingredients (comma separated)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="w-full bg-black border border-golden/30 rounded px-3 py-2 text-white" />
              </div>
              <div className="col-span-2">
                <label className="text-white2 text-sm block mb-1">Images</label>
                {form.images.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={url} onChange={(e) => setImage(i, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-black border border-golden/30 rounded px-3 py-2 text-white text-sm" />
                    {form.images.length > 1 && (
                      <button onClick={() => removeImageField(i)} className="text-red-500 px-2">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addImageField} className="text-golden text-sm hover:underline">+ Add image</button>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} id="avail" />
                <label htmlFor="avail" className="text-white2">Available</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-white2 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="button">{editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-golden border-b border-golden/20 text-sm">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Images</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-golden/10">
                <td className="py-3 pr-4 text-white">{p.name}</td>
                <td className="py-3 pr-4 text-white2 text-sm">
                  {typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name}
                </td>
                <td className="py-3 pr-4 text-golden">${p.price}</td>
                <td className="py-3 pr-4 text-white2 text-sm capitalize">{p.type}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1">
                    {(p.images || []).filter(Boolean).map((img: string, i: number) => (
                      <img key={i} src={img} alt="" className="w-8 h-8 object-cover rounded border border-golden/20" />
                    ))}
                    {(!p.images || p.images.length === 0) && <span className="text-white2 text-xs">—</span>}
                  </div>
                </td>
                <td className="py-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-golden hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
