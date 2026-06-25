"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross, ImWarning } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface OpenDayDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClose?: () => void;
  onCloseDate?: (date: string) => void;
}

export default function OpenDayDialog({ open, onOpenChange, onClose, onCloseDate }: OpenDayDialogProps) {
  const { t } = useT();
  const now = new Date();
  const [openResult, setOpenResult] = useState<any>(null);
  const [opening, setOpening] = useState(false);
  const [workShifts, setWorkShifts] = useState<any[]>([]);
  const [openShiftId, setOpenShiftId] = useState("");

  useEffect(() => {
    if (open) {
      setOpenResult(null);
      setOpenShiftId("");
      fetch("/api/work-shifts").then((r) => r.json()).then(setWorkShifts);
    }
  }, [open]);

  const handleOpenDay = async () => {
    setOpening(true);
    try {
      const res = await fetch("/api/day-opening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workShiftId: openShiftId || undefined }),
      });
      const result = await res.json();
      if (!res.ok) {
        setOpenResult({ error: result.error, reason: result.reason, blockingDate: result.blockingDate });
      } else {
        setOpenResult({ success: true, opening: result });
      }
      onClose?.();
    } catch {
      setOpenResult({ error: "Failed to open day" });
      onClose?.();
    }
    setOpening(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-popover">
        <DialogHeader><DialogTitle>{t("reports.openDay")} — {now.toLocaleDateString()}</DialogTitle></DialogHeader>

        {openResult?.error ? (
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-3">
              <ImWarning className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">{openResult.error}</p>
                {openResult.reason && <p className="text-sm text-muted-foreground mt-1">{openResult.reason}</p>}
              </div>
            </div>
            {openResult.blockingDate && (
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={async () => {
                  if (onCloseDate && openResult.blockingDate) {
                    await onCloseDate(openResult.blockingDate);
                  }
                  setOpenResult(null);
                }}
              >
                <ImCheckmark className="w-3 h-3" /> {t("reports.close")} {openResult.blockingDate}
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          </div>
        ) : openResult?.success ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <ImCheckmark className="w-5 h-5" /> Day opened
            </div>
            <p className="text-sm text-muted-foreground">Opened by {openResult.opening.openedBy}</p>
            <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); setOpenResult(null); }}>{t("common.ok")}</Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This will open the work day. All previous working days must be closed first.
            </p>
            <div className="grid gap-2">
              <Label>{t("settings.shifts")}</Label>
              <select value={openShiftId} onChange={(e) => setOpenShiftId(e.target.value)}
                className="bg-background border border-input rounded px-3 py-2 text-sm w-full">
                <option value="">{t("reports.selectShift")}</option>
                {workShifts.filter((ws: any) => ws.active).map((ws: any) => (
                  <option key={ws._id} value={ws._id}>{ws.name} ({ws.startTime} - {ws.endTime})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
              <Button onClick={handleOpenDay} disabled={opening} className="gap-2">
                <ImCheckmark className="w-3 h-3" /> {opening ? t("common.loading") : t("reports.openDay")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
