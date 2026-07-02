"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImPencil, ImBin } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useT } from "@/i18n/useT";
import { ProductFormDialog } from "@/components/dashboard/products/ProductFormDialog";

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
  taxIds: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface Tax {
  _id: string;
  name: string;
  rate: number;
  scope: "product" | "global";
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
  featured: false,
  turnIds: [] as string[],
  taxIds: [] as string[],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [turns, setTurns] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { t } = useT();
  const [bcvRate, setBcvRate] = useState(0);
  const [usdtRate, setUsdtRate] = useState(0);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchData = () => {
    Promise.all([
      fetch("/api/backoffice/products").then((r) => r.json()),
      fetch("/api/backoffice/categories").then((r) => r.json()),
      fetch("/api/backoffice/exchange-rate").then((r) => r.json()).then((d) => {
        setBcvRate(d.exchangeRateBcv || 0);
        setUsdtRate(d.exchangeRateUsdt || 0);
      }).catch(() => {}),
    ]).then(([products, categories]) => {
      setProducts(products);
      setCategories(categories);
      setLoading(false);
    });
  };

  const fetchDialogData = () => {
    Promise.all([
      fetch("/api/backoffice/turns").then(r => r.json()),
      fetch("/api/backoffice/taxes").then(r => r.json()),
    ]).then(([turns, taxes]) => {
      setTurns(turns);
      setTaxes(taxes.filter((t: Tax) => t.scope === "product"));
    });
  };

  useEffect(fetchData, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setOpen(true);
    fetchDialogData();
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
      available: p.available ?? true,
      featured: (p as any).featured ?? false,
      turnIds: (p as any).turnIds?.map((t: any) => typeof t === "string" ? t : t._id) || [],
      taxIds: (p as any).taxIds?.map((t: any) => typeof t === "string" ? t : t._id) || [],
    });
    setEditingId(p._id);
    setOpen(true);
    fetchDialogData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirmDelete"))) return;
    await fetch(`/api/backoffice/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("products.title")}</h1>
        <Button onClick={openCreate} className="gap-2"><ImPlus /> {t("products.add")}</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <span className="text-sm text-muted-foreground">{filtered.length} {t("products.results")}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("products.allProducts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("products.category")}</TableHead>
                <TableHead>{t("products.price")}</TableHead>
                <TableHead>{t("common.type")}</TableHead>
                <TableHead>{t("products.images")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {typeof p.categoryId === "string" ? p.categoryId : p.categoryId?.name}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{bcvRate > 0 ? `Bs ${(p.price * bcvRate).toLocaleString("es-VE", { minimumFractionDigits: 2 })}` : `$${p.price}`}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ ${p.price}</span>
                  </TableCell>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {t("products.results")}
          {totalPages > 1 && ` · ${t("products.pageOf")} ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.previous")}</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t("common.next")}</Button>
          </div>
        )}
      </div>

      <ProductFormDialog
        open={open}
        onOpenChange={setOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        categories={categories}
        turns={turns}
        taxes={taxes}
        onSaved={fetchData}
      />
    </div>
  );
}
