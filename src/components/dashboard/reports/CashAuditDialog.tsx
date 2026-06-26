"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface CashAuditDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClose?: () => void;
}

export default function CashAuditDialog({ open, onOpenChange, onClose }: CashAuditDialogProps) {
  const { t } = useT();
  const [workShifts, setWorkShifts] = useState<any[]>([]);
  const [caResult, setCaResult] = useState<any>(null);
  const [caCreating, setCaCreating] = useState(false);
  const [caShiftId, setCaShiftId] = useState("");
  const [caDeclared, setCaDeclared] = useState(0);
  const [caNotes, setCaNotes] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/backoffice/work-shifts").then((r) => r.json()).then(setWorkShifts);
      setCaShiftId("");
      setCaDeclared(0);
      setCaNotes("");
      setCaResult(null);
    }
  }, [open]);

  const handleCashAudit = async () => {
    setCaCreating(true);
    try {
      const res = await fetch("/api/backoffice/cash-audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workShiftId: caShiftId || undefined,
          declaredCash: Number(caDeclared),
          notes: caNotes,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setCaResult({ error: result.error });
      } else {
        setCaResult({ success: true, audit: result });
      }
    } catch {
      setCaResult({ error: "Failed to record cash audit" });
    }
    setCaCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-popover">
        <DialogHeader><DialogTitle>{t("reports.cashAudit")}</DialogTitle></DialogHeader>

        {caResult?.error ? (
          <div className="py-4"><p className="text-destructive font-medium">{caResult.error}</p></div>
        ) : caResult?.success ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <ImCheckmark className="w-5 h-5" /> Audit recorded
            </div>
            <div className="border rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>{t("reports.expectedCash")}</span><span>${caResult.audit.expectedCash.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>{t("reports.declaredCash")}</span><span>${caResult.audit.declaredCash.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium">
                <span>{t("reports.difference")}</span>
                <span className={caResult.audit.difference >= 0 ? "text-green-600" : "text-red-600"}>
                  {caResult.audit.difference >= 0 ? "+" : ""}{caResult.audit.difference.toFixed(2)}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); setCaResult(null); }}>{t("common.ok")}</Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="grid gap-2">
              <Label>{t("settings.shifts")}</Label>
              <select value={caShiftId} onChange={(e) => setCaShiftId(e.target.value)}
                className="bg-background border border-input rounded px-3 py-2 text-sm w-full">
                <option value="">{t("reports.selectShift")}</option>
                {workShifts.filter((ws: any) => ws.active).map((ws: any) => (
                  <option key={ws._id} value={ws._id}>{ws.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>{t("reports.declaredCash")} ($)</Label>
              <Input type="number" step="0.01" value={caDeclared}
                onChange={(e) => setCaDeclared(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>{t("common.notes")}</Label>
              <textarea className="bg-background border border-input rounded px-3 py-2 text-sm w-full min-h-[60px]"
                value={caNotes} onChange={(e) => setCaNotes(e.target.value)}
                placeholder="Optional notes" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
              <Button onClick={handleCashAudit} disabled={caCreating} className="gap-2">
                <ImCheckmark className="w-3 h-3" /> {caCreating ? t("common.loading") : t("reports.recordAudit")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
