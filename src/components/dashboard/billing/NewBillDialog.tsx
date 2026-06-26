"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
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

export interface NewBillDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBillCreated: () => void;
}

export default function NewBillDialog({ open, onOpenChange, onBillCreated }: NewBillDialogProps) {
  const { t } = useT();
  const [comandas, setComandas] = useState<any[]>([]);
  const [form, setForm] = useState({
    comandaId: "", customerName: "", customerEmail: "", customerPhone: "",
    paymentMethod: "Cash", paymentType: "cash",
    paymentData: {} as Record<string, string>,
    orderCharges: [] as { name: string; amount: number }[],
    cashRegisterId: "",
  });
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [chargeDefs, setChargeDefs] = useState<any[]>([]);
  const [pmMethods, setPmMethods] = useState<any[]>([]);
  const [currentPmFields, setCurrentPmFields] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [cashRegisters, setCashRegisters] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((s) => {
      if (s?.user?.name) setUserName(s.user.name);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    fetch("/api/backoffice/comandas").then((r) => r.json()).then((cs) => {
      const openCs = cs.filter((c: any) => c.status === "open");
      setComandas(openCs);
      setForm({
        comandaId: "", customerName: "", customerEmail: "", customerPhone: "",
        paymentMethod: "Cash", paymentType: "cash", paymentData: {}, orderCharges: [],
        cashRegisterId: "",
      });
      setPedidos([]);
      setPreview([]);
      setChargeDefs([]);
      setCurrentPmFields([]);
    });
    Promise.all([
      fetch("/api/backoffice/charges").then((r) => r.json()),
      fetch("/api/backoffice/payment-methods").then((r) => r.json()),
      fetch("/api/backoffice/cash-registers").then((r) => r.json()),
    ]).then(([charges, methods, registers]) => {
      setChargeDefs(charges);
      setPmMethods(methods.filter((m: any) => m.active));
      setCashRegisters(registers);
    });
  }, [open]);

  const loadComanda = async (comandaId: string) => {
    if (!comandaId) {
      setPedidos([]);
      setPreview([]);
      setForm({ ...form, comandaId: "", paymentType: "cash", paymentData: {}, orderCharges: [] });
      return;
    }
    const comanda = comandas.find((c) => c._id === comandaId);
    const res = await fetch(`/api/backoffice/pedidos?comandaId=${comandaId}`);
    const ps = await res.json();
    setPedidos(ps);

    const items: any[] = [];
    const itemMap = new Map<string, any>();
    for (const p of ps) {
      for (const it of p.items) {
        const key = it.name;
        if (itemMap.has(key)) itemMap.get(key).quantity += it.quantity;
        else itemMap.set(key, { name: it.name, price: it.price, quantity: it.quantity });
      }
    }
    const consolidated = Array.from(itemMap.values());
    setPreview(consolidated);

    const subtotal = consolidated.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const isDelivery = comanda?.isDelivery || false;

    const orderCharges = chargeDefs
      .filter((c: any) => c.active && c.scope === "global")
      .filter((c: any) => !c.appliesToDelivery || isDelivery)
      .map((c: any) => {
        let amount = 0;
        if (c.type === "percentage") {
          const base = c.applyTo?.includes("delivery") && isDelivery ? subtotal + 5 : subtotal;
          amount = Math.round(base * (c.value / 100) * 100) / 100;
        } else {
          amount = c.value;
        }
        return { name: c.name, amount };
      });

    setForm({ ...form, comandaId, customerName: comanda?.customerName || "", orderCharges });
  };

  const handleCreate = async () => {
    await fetch("/api/backoffice/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comandaId: form.comandaId || undefined,
        pedidoIds: pedidos.map((p) => p._id),
        items: preview,
        tableLabel: comandas.find((c) => c._id === form.comandaId)?.tableLabel,
        isDelivery: comandas.find((c) => c._id === form.comandaId)?.isDelivery || false,
        orderCharges: form.orderCharges,
        paymentMethod: form.paymentMethod,
        paymentType: form.paymentType,
        paymentData: form.paymentData,
        customer: { name: form.customerName, email: form.customerEmail, phone: form.customerPhone },
        createdBy: userName,
        cashRegisterId: form.cashRegisterId || undefined,
        status: "pending",
      }),
    });
    onOpenChange(false);
    onBillCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{t("billing.newBill")}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Comanda</Label>
            <Select value={form.comandaId} onValueChange={loadComanda}>
              <SelectTrigger><SelectValue placeholder={t("billing.selectComanda")} /></SelectTrigger>
              <SelectContent>
                {comandas.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.tableLabel || "Bar"} — {c.customerName || t("billing.walkIn")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{t("settings.cashRegister")}</Label>
            <Select value={form.cashRegisterId} onValueChange={(v) => setForm({ ...form, cashRegisterId: v })}>
              <SelectTrigger><SelectValue placeholder={t("common.select") || "Select..."} /></SelectTrigger>
              <SelectContent>
                {cashRegisters.map((cr: any) => (
                  <SelectItem key={cr._id} value={cr._id}>{cr.name}</SelectItem>
                ))}
                {cashRegisters.length === 0 && (
                  <SelectItem value="none" disabled>{t("common.noData") || "No registers"}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {preview.length > 0 && (
            <div className="border rounded-lg p-3 space-y-1 text-sm">
              <Label>{t("billing.items")}</Label>
              {preview.map((item, i) => (
                <div key={i} className="flex justify-between text-muted-foreground">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium border-t pt-2">
                <span>{t("billing.subtotal")}</span>
                <span>${preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}</span>
              </div>
              {(form.orderCharges || []).map((ch, i) => (
                <div key={ch.name} className="flex justify-between text-xs text-muted-foreground items-center">
                  <span>{ch.name}</span>
                  <Input type="number" step="0.01" className="w-20 h-7 text-xs text-right"
                    value={ch.amount}
                    onChange={(e) => {
                      const updated = [...form.orderCharges];
                      updated[i] = { ...updated[i], amount: Number(e.target.value) };
                      setForm({ ...form, orderCharges: updated });
                    }} />
                </div>
              ))}
              <div className="flex justify-between text-xs text-amber-500">
                <span>{t("billing.iva")}</span>
                <span>{t("billing.calculatedOnConfirm")}</span>
              </div>
              <div className="flex justify-between font-bold text-golden border-t pt-2">
                <span>{t("billing.estimatedTotal")}</span>
                <span>
                  ${(preview.reduce((s: number, i: any) => s + i.price * i.quantity, 0) + (form.orderCharges || []).reduce((s: number, ch: any) => s + ch.amount, 0)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>{t("billing.paymentMethod")}</Label>
            <Select value={form.paymentMethod} onValueChange={(v) => {
              const pm = pmMethods.find((m: any) => m.type === v);
              setCurrentPmFields(pm?.fields || []);
              const paymentData: Record<string, string> = {};
              for (const f of pm?.fields || []) {
                if (f.type === "select" && f.options?.length) paymentData[f.key] = f.options[0];
                else paymentData[f.key] = "";
              }
              setForm({ ...form, paymentMethod: pm?.label || v, paymentType: v, paymentData });
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {pmMethods.map((pm: any) => (
                  <SelectItem key={pm._id} value={pm.type}>{pm.label}</SelectItem>
                ))}
                {pmMethods.length === 0 && (
                  <SelectItem value="cash" disabled>No methods configured</SelectItem>
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
                      value={form.paymentData[f.key] || ""}
                      onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })}
                      className="bg-background border border-input rounded h-8 text-xs px-2 w-full"
                    >
                      {(f.options || []).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === "time" ? (
                    <Input type="time" className="h-8 text-xs" value={form.paymentData[f.key] || ""}
                      onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })} />
                  ) : (
                    <Input type={f.type === "number" ? "number" : "text"} className="h-8 text-xs"
                      placeholder={f.placeholder || f.label}
                      value={form.paymentData[f.key] || ""}
                      onChange={(e) => setForm({ ...form, paymentData: { ...form.paymentData, [f.key]: e.target.value } })} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">{t("billing.customer")}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid gap-1">
                <Label className="text-xs">{t("common.name")}</Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">{t("bookings.email")}</Label>
                <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">{t("bookings.phone")}</Label>
                <Input value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
          <Button onClick={handleCreate} disabled={preview.length === 0} className="gap-2"><ImCheckmark /> {t("common.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
