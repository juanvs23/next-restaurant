"use client";
import { ImPlus, ImCross, ImCheckmark } from "react-icons/im";
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
import { MediaPicker } from "@/components/dashboard/media-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingId: string | null;
  form: any;
  setForm: (f: any) => void;
  categories: any[];
  turns: any[];
  taxes: any[];
  onSaved: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  categories,
  turns,
  taxes,
  onSaved,
}: ProductFormDialogProps) {
  const { t } = useT();

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageField = (i: number) =>
    setForm({ ...form, images: form.images.filter((_: any, idx: number) => idx !== i) });
  const setImage = (i: number, v: string) => {
    const imgs = [...form.images];
    imgs[i] = v;
    setForm({ ...form, images: imgs });
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
      turnIds: form.turnIds,
      taxIds: form.taxIds,
    };

    await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-popover">
        <DialogHeader>
          <DialogTitle>{t(editingId ? "products.edit" : "products.new")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("common.name")}</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">{t("common.description")}</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">{t("products.price")}</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">{t("products.sku")}</Label>
              <Input id="sku" value={form.SKU} onChange={(e) => setForm({ ...form, SKU: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("products.category")}</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder={t("common.search")} /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("common.type")}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">{t("products.food")}</SelectItem>
                  <SelectItem value="drink">{t("products.drink")}</SelectItem>
                  <SelectItem value="dessert">{t("products.dessert")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("products.ingredients")}</Label>
            <Input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sku">{t("products.sku")}</Label>
            <Input id="sku" value={form.SKU} onChange={(e) => setForm({ ...form, SKU: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>{t("products.taxes")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("products.taxesHint")}
            </p>
            <div className="flex flex-wrap gap-2">
              {taxes.length === 0 && (
                <span className="text-xs text-muted-foreground">{t("products.noTaxes")}</span>
              )}
              {taxes.map((tx: any) => {
                const selected = form.taxIds.includes(tx._id);
                return (
                  <button
                    key={tx._id}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        taxIds: selected
                          ? form.taxIds.filter((id: string) => id !== tx._id)
                          : [...form.taxIds, tx._id],
                      });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selected
                        ? "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300"
                        : "bg-background border-border text-muted-foreground hover:border-amber-500/30"
                    }`}
                  >
                    {tx.name} ({(tx.rate * 100).toFixed(0)}%)
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("products.turns")}</Label>
            <div className="flex flex-wrap gap-2">
              {turns.map((tr: any) => {
                const selected = form.turnIds.includes(tr._id);
                return (
                  <button
                    key={tr._id}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        turnIds: selected
                          ? form.turnIds.filter((id: string) => id !== tr._id)
                          : [...form.turnIds, tr._id],
                      });
                    }}
                    className="px-3 py-1.5 rounded-full text-sm border transition-all"
                    style={{
                      backgroundColor: selected ? tr.color : "transparent",
                      borderColor: tr.color,
                      color: selected ? "#000" : tr.color,
                    }}
                  >
                    {tr.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("products.images")}</Label>
            {form.images.map((url: string, i: number) => (
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
              <ImPlus className="w-3 h-3" /> {t("products.addImage")}
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
            <Label htmlFor="avail">{t("products.available")}</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
            <ImCross /> {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <ImCheckmark /> {t(editingId ? "common.update" : "common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
