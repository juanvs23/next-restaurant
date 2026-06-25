"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross, ImWarning } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface ManualCloseDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClose?: () => void;
}

export default function ManualCloseDialog({ open, onOpenChange, onClose }: ManualCloseDialogProps) {
  const { t } = useT();
  const [manualCloseDate, setManualCloseDate] = useState("");
  const [manualClosing, setManualClosing] = useState(false);
  const [manualCloseResult, setManualCloseResult] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setManualCloseDate("");
      setManualCloseResult(null);
    }
  }, [open]);

  const handleManualClose = async () => {
    if (!manualCloseDate) return;
    setManualClosing(true);
    setManualCloseResult(null);
    try {
      const res = await fetch("/api/reports/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: manualCloseDate }),
      });
      const result = await res.json();
      if (!res.ok) {
        setManualCloseResult({ error: result.error, reason: result.reason });
      } else {
        setManualCloseResult({ success: true, closing: result.closing });
        onClose?.();
      }
    } catch {
      setManualCloseResult({ error: "Failed to close day" });
    }
    setManualClosing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setManualCloseResult(null); }}>
      <DialogContent className="sm:max-w-sm bg-popover">
        <DialogHeader><DialogTitle>{t("reports.closeDayTitle")}</DialogTitle></DialogHeader>

        {manualCloseResult?.error ? (
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-3">
              <ImWarning className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">{manualCloseResult.error}</p>
                {manualCloseResult.reason && <p className="text-sm text-muted-foreground mt-1">{manualCloseResult.reason}</p>}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setManualCloseResult(null)}>Reintentar</Button>
          </div>
        ) : manualCloseResult?.success ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <ImCheckmark className="w-5 h-5" /> {manualCloseDate} {t("reports.closed")}
            </div>
            <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); setManualCloseResult(null); }}>{t("common.ok")}</Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="grid gap-2">
              <Label>{t("reports.dateToClose")}</Label>
              <Input type="date" value={manualCloseDate}
                onChange={(e) => setManualCloseDate(e.target.value)} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
              <Button onClick={handleManualClose} disabled={manualClosing || !manualCloseDate} className="gap-2">
                <ImCheckmark className="w-3 h-3" /> {manualClosing ? t("common.loading") : t("reports.closeDay")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
