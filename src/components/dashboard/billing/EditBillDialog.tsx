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

export interface EditBillDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bill: any;
  onSaved: () => void;
}

export default function EditBillDialog({ open, onOpenChange, bill, onSaved }: EditBillDialogProps) {
  const { t } = useT();
  const [editForm, setEditForm] = useState<any>({});
  const [pmMethods, setPmMethods] = useState<any[]>([]);
  const [currentPmFields, setCurrentPmFields] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !bill) return;
    fetch("/api/payment-methods").then((r) => r.json()).then((methods) => {
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
  }, [open, bill]);

  const handleEditSave = async () => {
    if (!bill) return;
    const pm = pmMethods.find((m: any) => m.type === editForm.paymentMethod);
    await fetch(`/api/orders/${bill._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { name: editForm.customerName, email: editForm.customerEmail, phone: editForm.customerPhone },
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
      <DialogContent className="bg-popover sm:max-w-sm">
        <DialogHeader><DialogTitle>{t("billing.editBill")}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
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
              <SelectTrigger><SelectValue /></SelectTrigger>
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
                  ) : (
                    <Input type={f.type === "number" ? "number" : "text"} className="h-8 text-xs"
                      placeholder={f.placeholder || f.label}
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
