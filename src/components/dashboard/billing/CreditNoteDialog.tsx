"use client";
import { useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";

export interface CreditNoteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: any;
  onIssued: () => void;
}

export default function CreditNoteDialog({ open, onOpenChange, order, onIssued }: CreditNoteDialogProps) {
  const { t } = useT();
  const [cnForm, setCnForm] = useState({ amount: 0, reason: "" });
  const [cnResult, setCnResult] = useState<any>(null);
  const [cnCreating, setCnCreating] = useState(false);

  const createCreditNote = async () => {
    if (!cnForm.reason.trim()) return;
    setCnCreating(true);
    try {
      const res = await fetch("/api/credit-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalOrderId: order._id,
          amount: Number(cnForm.amount),
          reason: cnForm.reason.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setCnResult({ error: result.error });
      } else {
        setCnResult({ success: true, note: result });
      }
      onIssued();
    } catch {
      setCnResult({ error: "Failed to create credit note" });
    }
    setCnCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setCnResult(null); }}>
      <DialogContent className="sm:max-w-md bg-popover">
        <DialogHeader><DialogTitle>{t("billing.issueCreditNote")}</DialogTitle></DialogHeader>

        {cnResult?.error ? (
          <div className="py-4 space-y-3">
            <p className="text-destructive font-medium">{cnResult.error}</p>
            <Button variant="outline" onClick={() => { setCnResult(null); }}>Try again</Button>
          </div>
        ) : cnResult?.success ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <ImCheckmark className="w-5 h-5" /> Credit note issued
            </div>
            <div className="border rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>#</span><span className="font-medium">CN-{String(cnResult.note.creditNoteNumber).padStart(5, "0")}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="font-medium">-${cnResult.note.total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Reason</span><span className="text-muted-foreground">{cnResult.note.reason}</span></div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); setCnResult(null); }}>OK</Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {order && (
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>Original invoice</span><span className="font-medium"># INV-{String(order.invoiceNumber || "").padStart(5, "0")}</span></div>
                <div className="flex justify-between"><span>{t("billing.customer")}</span><span className="font-medium">{order.customer?.name || t("billing.walkIn")}</span></div>
                <div className="flex justify-between"><span>Original total</span><span className="font-medium">${order.total?.toFixed(2)}</span></div>
              </div>
            )}
            <div className="grid gap-2">
              <Label>Amount to credit</Label>
              <Input type="number" step="0.01" min={0.01} max={order?.total || 0}
                value={cnForm.amount}
                onChange={(e) => setCnForm({ ...cnForm, amount: Number(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label>Reason *</Label>
              <textarea
                className="bg-background border border-input rounded px-3 py-2 text-sm w-full min-h-[60px]"
                value={cnForm.reason}
                onChange={(e) => setCnForm({ ...cnForm, reason: e.target.value })}
                placeholder="Describe the reason for this credit note..."
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
              <Button onClick={createCreditNote} disabled={cnCreating || !cnForm.reason.trim() || !cnForm.amount} className="gap-2">
                <ImCheckmark className="w-3 h-3" /> {cnCreating ? "Issuing..." : t("billing.issueCreditNote")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
