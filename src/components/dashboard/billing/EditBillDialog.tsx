"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross, ImPlus, ImMinus } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";
import { formatVes } from "@/libs/currency";
import ProductSearch from "./ProductSearch";
import CurrencyInput from "./CurrencyInput";

export interface EditBillDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bill: any;
  onSaved: () => void;
}

export default function EditBillDialog({ open, onOpenChange, bill, onSaved }: EditBillDialogProps) {
  const { t } = useT();
  const [editForm, setEditForm] = useState<any>({});
  const [editItems, setEditItems] = useState<any[]>([]);
  const [pmMethods, setPmMethods] = useState<any[]>([]);
  const [currentPmFields, setCurrentPmFields] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !bill) return;
    fetch("/api/backoffice/payment-methods").then((r) => r.json()).then((methods) => {
      const active = methods.filter((m: any) => m.active);
      setPmMethods(active);
      const pm = active.find((m: any) => m.type === (bill.paymentType || bill.paymentMethod));
      setCurrentPmFields(pm?.fields || []);
    });
    setEditForm({
      customerName: bill.customer?.name || "",
      customerEmail: bill.customer?.email || "",
      customerPhone: bill.customer?.phone || "",
      paymentMethod: bill.paymentType || bill.paymentMethod || "cash",
      paymentData: bill.paymentData || {},
    });
    setEditItems((bill.items || []).map((it: any) => ({
      productId: it.productId,
      name: it.name,
      price: it.price || 0,
      quantity: it.quantity || 1,
    })));

    // Fetch all products for adding to bill
    fetch("/api/frontend/menu/breakdown")
      .then((r) => r.json())
      .then((data) => {
        const products: any[] = [];
        for (const cat of data.categories || []) {
          for (const p of cat.products || []) {
            products.push({ productId: p._id, name: p.name, price: p.price || 0 });
          }
        }
        setAvailableProducts(products);
      })
      .catch(() => setAvailableProducts([]));
  }, [open, bill]);

  const updateItemQty = (idx: number, delta: number) => {
    const updated = [...editItems];
    updated[idx] = { ...updated[idx], quantity: Math.max(0, updated[idx].quantity + delta) };
    setEditItems(updated.filter((it) => it.quantity > 0));
  };

  const subtotal = editItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const rate = bill?.exchangeRateBcv || 1;

  const handleEditSave = async () => {
    if (!bill) return;
    const pm = pmMethods.find((m: any) => m.type === editForm.paymentMethod);
    await fetch(`/api/backoffice/orders/${bill._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: editItems.map((it: any) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
        })),
        customer: editForm.customerName ? {
          name: editForm.customerName,
          ...(editForm.customerEmail ? { email: editForm.customerEmail } : {}),
        } : undefined,
        paymentMethod: pm?.label || editForm.paymentMethod,
        paymentType: editForm.paymentMethod,
        paymentData: editForm.paymentData,
      }),
    });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{t("billing.editBill")}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Items */}
          <div>
            <Label className="text-xs font-semibold mb-2 block">{t("billing.items")}</Label>
            <div className="border rounded-lg divide-y">
              {editItems.length === 0 && (
                <p className="text-muted-foreground text-xs p-2">{t("common.noData")}</p>
              )}
              {editItems.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatVes(it.price * rate)} × {it.quantity} = {formatVes(it.price * rate * it.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                      onClick={() => updateItemQty(idx, -1)}>
                      <ImMinus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{it.quantity}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                      onClick={() => updateItemQty(idx, 1)}>
                      <ImPlus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add product */}
            {availableProducts.length > 0 && (
              <div className="mt-2">
                <ProductSearch products={availableProducts} placeholder="Add product..." onSelect={(prod) => {
                  const existing = editItems.findIndex((it) => (it.productId && it.productId === prod.productId) || it.name === prod.name);
                  if (existing >= 0) {
                    const updated = [...editItems];
                    updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + 1 };
                    setEditItems(updated);
                  } else {
                    setEditItems([...editItems, { productId: prod.productId || prod._id, name: prod.name, price: prod.price, quantity: 1 }]);
                  }
                }} />
              </div>
            )}
            {editItems.length > 0 && (
              <p className="text-sm text-right mt-1 font-medium">
                {t("billing.subtotal")}: {formatVes(subtotal * rate)}
              </p>
            )}
          </div>

          {/* Payment method */}
          <div className="grid gap-2">
            <Label>{t("billing.paymentMethod")}</Label>
            <Select value={editForm.paymentMethod} onValueChange={(v) => {
              const pm = pmMethods.find((m: any) => m.type === v);
              setCurrentPmFields(pm?.fields || []);
              const paymentData: Record<string, string> = {};
              for (const f of pm?.fields || []) {
                paymentData[f.key] = editForm.paymentData?.[f.key] || (f.type === "select" && f.options?.length ? f.options[0] : "");
              }
              setEditForm({ ...editForm, paymentMethod: v, paymentData });
            }}>
              <SelectTrigger><SelectValue placeholder="Cash" /></SelectTrigger>
              <SelectContent>
                {pmMethods.map((pm: any) => (
                  <SelectItem key={pm._id} value={pm.type}>{pm.label}</SelectItem>
                ))}
                {pmMethods.length === 0 && (
                  <>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {currentPmFields.length > 0 && (
            <div className="border rounded-lg p-3 space-y-2">
              <Label className="text-xs font-semibold">{t("billing.paymentDetails")}</Label>
              {currentPmFields.map((f: any) => (
                <div key={f.key} className="grid gap-1">
                  <Label className="text-xs">
                    {f.label}
                    {f.required && <span className="text-destructive ml-0.5">*</span>}
                  </Label>
                  {f.type === "select" ? (
                    <select
                      value={editForm.paymentData?.[f.key] || ""}
                      onChange={(e) => setEditForm({ ...editForm, paymentData: { ...editForm.paymentData, [f.key]: e.target.value } })}
                      className="bg-background border border-input rounded h-8 text-xs px-2 w-full"
                    >
                      {(f.options || []).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === "time" ? (
                    <Input type="time" className="h-8 text-xs" value={editForm.paymentData?.[f.key] || ""}
                      onChange={(e) => setEditForm({ ...editForm, paymentData: { ...editForm.paymentData, [f.key]: e.target.value } })} />
                  ) : f.type === "number" ? (
                    <CurrencyInput className="h-8 text-xs" placeholder={f.placeholder || f.label}
                      value={editForm.paymentData?.[f.key] || ""}
                      onChange={(v) => setEditForm({ ...editForm, paymentData: { ...editForm.paymentData, [f.key]: v } })} />
                  ) : (
                    <Input type="text" className="h-8 text-xs" placeholder={f.placeholder || f.label}
                      value={editForm.paymentData?.[f.key] || ""}
                      onChange={(e) => setEditForm({ ...editForm, paymentData: { ...editForm.paymentData, [f.key]: e.target.value } })} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">{t("billing.customer")}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid gap-1"><Label className="text-xs">{t("common.name")}</Label><Input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} /></div>
              <div className="grid gap-1"><Label className="text-xs">{t("bookings.email")}</Label><Input value={editForm.customerEmail} onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })} /></div>
              <div className="grid gap-1"><Label className="text-xs">{t("bookings.phone")}</Label><Input value={editForm.customerPhone} onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })} /></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
          <Button onClick={handleEditSave} className="gap-2"><ImCheckmark /> {t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
