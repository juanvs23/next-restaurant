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

const toVes = (usd: number, rate: number) => (rate > 0 ? usd * rate : 0);
const round = (n: number) => Math.round(n * 100) / 100;

export interface NewBillDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBillCreated: () => void;
}

export default function NewBillDialog({ open, onOpenChange, onBillCreated }: NewBillDialogProps) {
  const { t } = useT();
  const [mode, setMode] = useState<"comanda" | "direct">("comanda");
  const [comandas, setComandas] = useState<any[]>([]);
  const [form, setForm] = useState({
    comandaId: "", customerName: "", customerEmail: "", customerPhone: "",
    paymentMethod: "cash", paymentType: "cash",
    paymentData: {} as Record<string, string>,
    orderCharges: [] as { name: string; type: string; value: number; amount: number }[],
    cashRegisterId: "",
  });
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [bcvRate, setBcvRate] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [serviceChargeRate, setServiceChargeRate] = useState(0);
  const [chargeDefs, setChargeDefs] = useState<any[]>([]);
  const [pmMethods, setPmMethods] = useState<any[]>([]);
  const [currentPmFields, setCurrentPmFields] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [cashRegisters, setCashRegisters] = useState<any[]>([]);
  // Direct mode
  const [products, setProducts] = useState<any[]>([]);
  const [directQty, setDirectQty] = useState(1);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((s) => {
      if (s?.user?.name) setUserName(s.user.name);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    fetch("/api/backoffice/comandas").then((r) => r.json()).then((cs) => {
      setComandas(cs.filter((c: any) => c.status === "open"));
    });
    fetch("/api/frontend/menu/breakdown").then((r) => r.json()).then((data) => {
      const prods: any[] = [];
      for (const cat of data.categories || [])
        for (const p of cat.products || [])
          prods.push({ _id: p._id, name: p.name, price: p.price || 0 });
      setProducts(prods);
    }).catch(() => {});
    // Reset
    setForm({ comandaId: "", customerName: "", customerEmail: "", customerPhone: "",
      paymentMethod: "cash", paymentType: "cash", paymentData: {}, orderCharges: [], cashRegisterId: "" });
    setPedidos([]);
    setPreview([]);
    setChargeDefs([]);
    setCurrentPmFields([]);
    setDirectQty(1);

    Promise.all([
      fetch("/api/backoffice/charges").then((r) => r.json()),
      fetch("/api/backoffice/payment-methods").then((r) => r.json()),
      fetch("/api/backoffice/cash-registers").then((r) => r.json()),
      fetch("/api/frontend/config").then(r => r.json()).then(cfg => {
        setBcvRate(cfg.exchangeRateBcv ?? 0);
        setTaxRate(cfg.taxRate ?? 0);
        setServiceChargeRate(cfg.serviceChargeRate ?? 0);
      }),
    ]).then(([charges, methods, registers]) => {
      setChargeDefs(charges);
      setPmMethods(methods.filter((m: any) => m.active));
      setCashRegisters(registers);
      const activeReg = registers.find((r: any) => r.active !== false);
      if (activeReg) setForm((f: any) => ({ ...f, cashRegisterId: activeReg._id }));
    });
  }, [open]);

  // Compute charges based on preview
  const computeCharges = (items: any[], isDelivery: boolean) => {
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    return chargeDefs.length > 0
      ? chargeDefs
          .filter((c: any) => c.active && c.scope === "global")
          .filter((c: any) => !c.appliesToDelivery || isDelivery)
          .map((c: any) => {
            const amount = c.type === "percentage"
              ? round((c.applyTo?.includes("delivery") && isDelivery ? subtotal + 5 : subtotal) * (c.value / 100))
              : c.value;
            return { name: c.name, type: c.type, value: c.value, amount };
          })
      : [
          ...(serviceChargeRate > 0 ? [{ name: "Servicio", type: "percentage" as const, value: serviceChargeRate * 100, amount: round(subtotal * serviceChargeRate) }] : []),
          ...(isDelivery ? [{ name: "Delivery", type: "fixed" as const, value: 5, amount: 5 }] : []),
        ];
  };

  // ── Comanda mode ──
  const loadComanda = async (comandaId: string) => {
    if (!comandaId) { setPedidos([]); setPreview([]); setForm({ ...form, comandaId: "", orderCharges: [] }); return; }
    const comanda = comandas.find((c) => c._id === comandaId);
    const res = await fetch(`/api/backoffice/pedidos?comandaId=${comandaId}`);
    const ps = await res.json();
    setPedidos(ps);

    const itemMap = new Map<string, any>();
    for (const p of ps)
      for (const it of p.items) {
        const key = it.name;
        if (itemMap.has(key)) itemMap.get(key).quantity += it.quantity;
        else itemMap.set(key, { name: it.name, price: it.price, quantity: it.quantity });
      }
    const items = Array.from(itemMap.values());
    setPreview(items);
    setForm({ ...form, comandaId, customerName: comanda?.customerName || "", orderCharges: computeCharges(items, comanda?.isDelivery || false) });
  };

  // ── Direct mode helpers ──
  const updateDirectQty = (idx: number, delta: number) => {
    const updated = preview.map((it, i) => i === idx ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it).filter((it) => it.quantity > 0);
    setPreview(updated);
    setForm({ ...form, orderCharges: computeCharges(updated, false) });
  };

  // ── Create ──
  const subtotalUsd = preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const isDelivery = mode === "comanda" ? (comandas.find((c) => c._id === form.comandaId)?.isDelivery || false) : false;

  const handleCreate = async () => {
    await fetch("/api/backoffice/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comandaId: mode === "comanda" ? form.comandaId || undefined : undefined,
        pedidoIds: mode === "comanda" ? pedidos.map((p) => p._id) : undefined,
        items: preview,
        tableLabel: mode === "comanda" ? comandas.find((c) => c._id === form.comandaId)?.tableLabel : undefined,
        isDelivery,
        orderCharges: form.orderCharges,
        paymentMethod: form.paymentMethod,
        paymentType: form.paymentType,
        paymentData: form.paymentData,
        customer: form.customerName ? {
          name: form.customerName,
          ...(form.customerEmail ? { email: form.customerEmail } : {}),
          ...(form.customerPhone ? { phone: form.customerPhone } : {}),
        } : undefined,
        createdBy: userName,
        cashRegisterId: form.cashRegisterId || undefined,
        status: "pending",
      }),
    });
    onOpenChange(false);
    onBillCreated();
  };

  const canCreate = preview.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{t("billing.newBill")}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-input bg-background p-0.5">
            {(["comanda", "direct"] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setPreview([]); setForm({ ...form, comandaId: "", orderCharges: [] }); }}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === m ? "bg-golden text-black2" : "text-muted-foreground hover:text-foreground"}`}>
                {m === "comanda" ? "Comanda" : "Directo"}
              </button>
            ))}
          </div>

          {/* Source selector */}
          {mode === "comanda" ? (
            <div className="grid gap-2">
              <Label>Comanda</Label>
              <Select value={form.comandaId} onValueChange={loadComanda}>
                <SelectTrigger><SelectValue placeholder={t("billing.selectComanda")} /></SelectTrigger>
                <SelectContent>
                  {comandas.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.tableLabel || "Bar"} — {c.customerName || t("billing.walkIn")}</SelectItem>
                  ))}
                  {comandas.length === 0 && <SelectItem value="none" disabled>No open comandas</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex gap-2 items-end">
              <div className="grid gap-1 flex-1">
                <Label className="text-xs">Producto</Label>
                <ProductSearch products={products} onSelect={(prod) => {
                  const existing = preview.findIndex((it) => it.name === prod.name);
                  let updated: any[];
                  if (existing >= 0) {
                    updated = [...preview];
                    updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + directQty };
                  } else {
                    updated = [...preview, { name: prod.name, price: prod.price, quantity: directQty }];
                  }
                  setPreview(updated);
                  setForm({ ...form, orderCharges: computeCharges(updated, false) });
                  setDirectQty(1);
                }} />
              </div>
              <div className="grid gap-1 w-16">
                <Label className="text-xs">Cant</Label>
                <Input type="number" min={1} max={99} value={directQty} onChange={(e) => setDirectQty(Math.max(1, parseInt(e.target.value) || 1))} className="h-8 text-xs text-center" />
              </div>
            </div>
          )}

          {/* Items preview */}
          {preview.length > 0 && (
            <div className="border rounded-lg p-3 space-y-1 text-sm">
              <Label>{t("billing.items")}</Label>
              {preview.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-sm">{item.quantity}× {item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatVes(toVes(item.price * item.quantity, bcvRate))}</span>
                  </div>
                  {mode === "direct" && (
                    <div className="flex items-center gap-0.5">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => updateDirectQty(i, -1)}><ImMinus className="w-3 h-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => updateDirectQty(i, 1)}><ImPlus className="w-3 h-3" /></Button>
                    </div>
                  )}
                </div>
              ))}
              {/* Subtotal */}
              <div className="flex justify-between font-medium border-t pt-2">
                <span>{t("billing.subtotal")}</span>
                <span>{formatVes(toVes(subtotalUsd, bcvRate))}</span>
              </div>
              {/* Charges */}
              {(form.orderCharges || []).map((ch, i) => (
                <div key={ch.name} className="flex justify-between text-xs text-muted-foreground items-center">
                  <div>
                    <span>{ch.name}</span>
                    {bcvRate > 0 && <span className="block text-[10px] text-muted-foreground/60">{formatVes(toVes(ch.amount, bcvRate))}</span>}
                  </div>
                  <Input type="number" step="0.01" className="w-20 h-7 text-xs text-right" value={ch.amount}
                    onChange={(e) => {
                      const updated = [...form.orderCharges];
                      updated[i] = { ...updated[i], amount: Number(e.target.value) };
                      setForm({ ...form, orderCharges: updated });
                    }} />
                </div>
              ))}
              {/* IVA */}
              <div className="flex justify-between text-xs text-amber-500">
                <span>{t("billing.iva")}{taxRate > 0 ? ` (${(taxRate * 100).toFixed(0)}%)` : ""}</span>
                <span>{taxRate > 0 ? formatVes(toVes(subtotalUsd * taxRate, bcvRate)) : "—"}</span>
              </div>
              {/* Estimated total */}
              <div className="flex justify-between font-bold text-golden border-t pt-2">
                <span>{t("billing.estimatedTotal")}</span>
                <span>
                  {formatVes(toVes(
                    subtotalUsd +
                    (form.orderCharges || []).reduce((s: number, ch: any) => s + ch.amount, 0) +
                    subtotalUsd * taxRate, bcvRate
                  ))}
                </span>
              </div>
            </div>
          )}

          {/* Cash register */}
          <div className="grid gap-2">
            <Label>{t("settings.cashRegister")}</Label>
            <Select value={form.cashRegisterId} onValueChange={(v) => setForm({ ...form, cashRegisterId: v })}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {cashRegisters.map((cr: any) => (
                  <SelectItem key={cr._id} value={cr._id}>{cr.name}</SelectItem>
                ))}
                {cashRegisters.length === 0 && <SelectItem value="none" disabled>{t("common.noData") || "No registers"}</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {/* Payment */}
          <div className="grid gap-2">
            <Label>{t("billing.paymentMethod")}</Label>
            <Select value={form.paymentMethod} onValueChange={(v) => {
              const pm = pmMethods.find((m: any) => m.type === v);
              setCurrentPmFields(pm?.fields || []);
              const pd: Record<string, string> = {};
              for (const f of pm?.fields || [])
                pd[f.key] = f.type === "select" && f.options?.length ? f.options[0] : "";
              setForm({ ...form, paymentMethod: v, paymentType: v, paymentData: pd });
            }}>
              <SelectTrigger><SelectValue placeholder="Cash" /></SelectTrigger>
              <SelectContent>
                {pmMethods.map((pm: any) => (
                  <SelectItem key={pm._id} value={pm.type}>{pm.label}</SelectItem>
                ))}
                {pmMethods.length === 0 && <SelectItem value="cash" disabled>No methods configured</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {currentPmFields.length > 0 && (
            <div className="border rounded-lg p-3 space-y-2">
              <Label className="text-xs font-semibold">{t("billing.paymentDetails")}</Label>
              {currentPmFields.map((f: any) => (
                <div key={f.key} className="grid gap-1">
                  <Label className="text-xs">{f.label}{f.required && <span className="text-destructive ml-0.5">*</span>}</Label>
                  {f.type === "select" ? (
                    <select value={form.paymentData[f.key] || ""} onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })}
                      className="bg-background border border-input rounded h-8 text-xs px-2 w-full">
                      {(f.options || []).map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                  ) : f.type === "time" ? (
                    <Input type="time" className="h-8 text-xs" value={form.paymentData[f.key] || ""}
                      onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })} />
                  ) : f.type === "number" ? (
                    <CurrencyInput className="h-8 text-xs" placeholder={f.placeholder || f.label}
                      value={form.paymentData[f.key] || ""}
                      onChange={(v) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: v } })} />
                  ) : (
                    <Input type="text" className="h-8 text-xs" placeholder={f.placeholder || f.label}
                      value={form.paymentData[f.key] || ""}
                      onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Customer */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">{t("billing.customer")}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid gap-1"><Label className="text-xs">{t("common.name")}</Label><Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></div>
              <div className="grid gap-1"><Label className="text-xs">{t("bookings.email")}</Label><Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
              <div className="grid gap-1"><Label className="text-xs">{t("bookings.phone")}</Label><Input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} /></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
          <Button onClick={handleCreate} disabled={!canCreate} className="gap-2"><ImCheckmark /> {t("common.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
