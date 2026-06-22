"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImBin, ImCross, ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MediaPicker } from "@/components/dashboard/media-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  turnIds: [] as string[],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [turns, setTurns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
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

  const openDialog = () => {
    fetch("/api/turns").then(r => r.json()).then(setTurns);
  };

  useEffect(fetchData, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setOpen(true);
    openDialog();
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      categoryId: typeof p.categoryId === "string" ? p.categoryId : p.categoryId?._id || "",
      type: p.type,
      ingredients: (p.ingredients || []).join(", "),
      images: p.images?.length ? p.images : [""],
      SKU: p.SKU || "",
      available: p.available,
      turnIds: (p as any).turnIds?.map((t: any) => typeof t === "string" ? t : t._id) || [],
    });
    setEditingId(p._id);
    setOpen(true);
    openDialog();
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      type: form.type,
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
      SKU: form.SKU,
      available: form.available,
      turnIds: form.turnIds,
    };

    await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageField = (i: number) =>
    setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) });
  const setImage = (i: number, v: string) => {
    const imgs = [...form.images];
    imgs[i] = v;
    setForm({ ...form, images: imgs });
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={openCreate} className="gap-2">
          <ImPlus /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name}
                  </TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell className="capitalize">{p.type}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(p.images || []).filter(Boolean).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-8 h-8 object-cover rounded border" />
                      ))}
                      {(!p.images || p.images.length === 0) && (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <ImPencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id)}>
                        <ImBin className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-popover">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "New"} Product</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.SKU} onChange={(e) => setForm({ ...form, SKU: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Ingredients (comma separated)</Label>
              <Input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label>Available Turns</Label>
              <div className="flex flex-wrap gap-2">
                {turns.map((t) => {
                  const selected = form.turnIds.includes(t._id);
                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          turnIds: selected
                            ? form.turnIds.filter((id: string) => id !== t._id)
                            : [...form.turnIds, t._id],
                        });
                      }}
                      className="px-3 py-1.5 rounded-full text-sm border transition-all"
                      style={{
                        backgroundColor: selected ? t.color : "transparent",
                        borderColor: t.color,
                        color: selected ? "#000" : t.color,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Images</Label>
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <MediaPicker value={url} onChange={(v) => setImage(i, v)} label="" />
                  </div>
                  {form.images.length > 1 && (
                    <Button variant="ghost" size="icon" className="mt-6" onClick={() => removeImageField(i)}>
                      <ImCross className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-fit gap-2" onClick={addImageField}>
                <ImPlus className="w-3 h-3" /> Add image
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="avail"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="avail">Available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="gap-2">
              <ImCross /> Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <ImCheckmark /> {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
