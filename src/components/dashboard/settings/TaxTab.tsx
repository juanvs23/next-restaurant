"use client";
import { useEffect, useState } from "react";
import { ImPlus, ImBin, ImPencil, ImCross, ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";

interface TaxTabProps {
  form: any;
  setForm: (f: any) => void;
}

export function TaxTab({ form, setForm }: TaxTabProps) {
  const { t } = useT();

  // Tax CRUD state
  const [taxes, setTaxes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [taxOpen, setTaxOpen] = useState(false);
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
  const [taxForm, setTaxForm] = useState({
    name: "", rate: 0, scope: "product" as "product" | "global",
    categoryIds: [] as string[],
    applyToServiceCharge: false, applyToDelivery: false, active: true,
  });

  const fetchTaxes = () => {
    Promise.all([
      fetch("/api/taxes").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([ts, cats]) => {
      setTaxes(ts);
      setCategories(cats);
    });
  };

  useEffect(() => { fetchTaxes(); }, []);

  const openCreateTax = () => {
    setTaxForm({ name: "", rate: 0, scope: "product", categoryIds: [], applyToServiceCharge: false, applyToDelivery: false, active: true });
    setEditingTaxId(null);
    setTaxOpen(true);
  };

  const openEditTax = (tax: any) => {
    setTaxForm({
      name: tax.name, rate: tax.rate, scope: tax.scope,
      categoryIds: (tax.categoryIds || []).map((c: any) => typeof c === "string" ? c : c._id),
      applyToServiceCharge: tax.applyToServiceCharge,
      applyToDelivery: tax.applyToDelivery,
      active: tax.active,
    });
    setEditingTaxId(tax._id);
    setTaxOpen(true);
  };

  const saveTax = async () => {
    const payload = { ...taxForm, rate: Number(taxForm.rate), categoryIds: taxForm.scope === "product" ? taxForm.categoryIds : [] };
    await fetch(editingTaxId ? `/api/taxes/${editingTaxId}` : "/api/taxes", {
      method: editingTaxId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setTaxOpen(false);
    fetchTaxes();
  };

  const deleteTax = async (id: string) => {
    if (!confirm(t("settings.deleteTaxConfirm"))) return;
    await fetch(`/api/taxes/${id}`, { method: "DELETE" });
    fetchTaxes();
  };

  const toggleTaxCategory = (catId: string) => {
    setTaxForm({
      ...taxForm,
      categoryIds: taxForm.categoryIds.includes(catId)
        ? taxForm.categoryIds.filter((id) => id !== catId)
        : [...taxForm.categoryIds, catId],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("settings.taxDefinitions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.taxDefinitionsHint")}
          </p>
        </div>
        <Button onClick={openCreateTax} size="sm" className="gap-2"><ImPlus /> {t("settings.addTax")}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.name")}</TableHead>
            <TableHead>{t("settings.rate")}</TableHead>
            <TableHead>{t("settings.scope")}</TableHead>
            <TableHead>{t("settings.applyTo")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxes.map((tx: any) => (
            <TableRow key={tx._id}>
              <TableCell className="font-medium">{tx.name}</TableCell>
              <TableCell>{(tx.rate * 100).toFixed(2)}%</TableCell>
              <TableCell className="capitalize">{tx.scope}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {tx.scope === "global"
                  ? [tx.applyToServiceCharge ? t("settings.serviceCharge") : null, tx.applyToDelivery ? t("settings.delivery") : null]
                      .filter(Boolean).join(", ") || t("settings.subtotalOnly")
                  : (tx.categoryIds as any[])?.length
                    ? tx.categoryIds.map((c: any) => c.name || c._id).join(", ")
                    : t("settings.allProducts")}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  tx.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>{tx.active ? t("common.active") : t("common.inactive")}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditTax(tx)}>
                    <ImPencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTax(tx._id)}>
                    <ImBin className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {taxes.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {t("settings.noTaxes")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="border-t pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <div className="grid gap-1">
            <Label>{t("settings.nextInvoice")}</Label>
            <Input type="number" value={form.nextInvoiceNumber}
              onChange={(e) => setForm({ ...form, nextInvoiceNumber: Number(e.target.value) })} />
          </div>
          <div className="grid gap-1">
            <Label>{t("settings.nextCreditNote")}</Label>
            <Input type="number" value={form.nextCreditNoteNumber}
              onChange={(e) => setForm({ ...form, nextCreditNoteNumber: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      <Dialog open={taxOpen} onOpenChange={setTaxOpen}>
        <DialogContent className="sm:max-w-lg bg-popover">
          <DialogHeader>
            <DialogTitle>{editingTaxId ? t("common.edit") : t("common.new")} {t("settings.tax")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.name")}</Label>
              <Input value={taxForm.name} onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                placeholder="IVA 16%, Alcohol 5%, ..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t("settings.rate")}</Label>
                <Input type="number" step="0.01" value={taxForm.rate * 100}
                  onChange={(e) => setTaxForm({ ...taxForm, rate: Number(e.target.value) / 100 })} />
              </div>
              <div className="grid gap-2">
                <Label>{t("settings.scope")}</Label>
                <Select value={taxForm.scope} onValueChange={(v: "product" | "global") =>
                  setTaxForm({ ...taxForm, scope: v, categoryIds: v === "global" ? [] : taxForm.categoryIds })
                }>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">{t("settings.perProduct")}</SelectItem>
                    <SelectItem value="global">{t("settings.global")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {taxForm.scope === "product" && (
              <div className="grid gap-2">
                <Label>{t("settings.applyToCategories")}</Label>
                <p className="text-xs text-muted-foreground">{t("settings.applyToCategoriesHint")}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {categories.map((cat: any) => {
                    const selected = taxForm.categoryIds.includes(cat._id);
                    return (
                      <button key={cat._id} type="button" onClick={() => toggleTaxCategory(cat._id)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          selected
                            ? "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300"
                            : "bg-background border-border text-muted-foreground hover:border-amber-500/30"
                        }`}>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {taxForm.scope === "global" && (
              <div className="space-y-3 border rounded-lg p-3">
                <Label className="text-sm font-medium">{t("settings.applyTo")}</Label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="taxApplySc" checked={taxForm.applyToServiceCharge}
                    onChange={(e) => setTaxForm({ ...taxForm, applyToServiceCharge: e.target.checked })} className="rounded" />
                  <Label htmlFor="taxApplySc">{t("settings.serviceCharge")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="taxApplyDel" checked={taxForm.applyToDelivery}
                    onChange={(e) => setTaxForm({ ...taxForm, applyToDelivery: e.target.checked })} className="rounded" />
                  <Label htmlFor="taxApplyDel">{t("settings.delivery")}</Label>
                </div>
                <p className="text-xs text-muted-foreground">{t("settings.alwaysAppliesToSubtotal")}</p>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="taxActive" checked={taxForm.active}
                onChange={(e) => setTaxForm({ ...taxForm, active: e.target.checked })} className="rounded" />
              <Label htmlFor="taxActive">{t("common.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaxOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
            <Button onClick={saveTax} className="gap-2" disabled={!taxForm.name}><ImCheckmark /> {editingTaxId ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
