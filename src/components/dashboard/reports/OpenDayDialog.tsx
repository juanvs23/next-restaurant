"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross, ImWarning } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const API_URLS = [
  "https://ve.dolarapi.com/v1/dolares",
  "https://pydolarve.com/api/dolar?moneda=usd",
  "https://open.er-api.com/v6/latest/USD",
];

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
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loadingRate, setLoadingRate] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    if (open) {
      setOpenResult(null);
      setOpenShiftId("");
      setLoadingRate(true);
      // Pre-fill with current Config exchange rate
      fetch("/api/frontend/config")
        .then((r) => r.json())
        .then((cfg) => setExchangeRate(cfg.exchangeRateBcv ?? 0))
        .catch(() => setExchangeRate(0))
        .finally(() => setLoadingRate(false));
      fetch("/api/backoffice/work-shifts").then((r) => r.json()).then(setWorkShifts);
    }
  }, [open]);

  const handleFetchRate = async () => {
    setFetchingRate(true);
    setFetchStatus("idle");

    let bcv = 0;
    let fallbackRate = 0;

    for (const url of API_URLS) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const data = await res.json();

        if (Array.isArray(data)) {
          const oficial = data.find((d: any) => d.fuente === "oficial" || d._id === "bcv");
          bcv = oficial?.promedio || oficial?.venta || bcv;
        } else if (data.rates?.VES) {
          fallbackRate = data.rates.VES;
        }
        if (bcv > 0) break;
      } catch {
        continue;
      }
    }

    if (bcv > 0) {
      setExchangeRate(bcv);
      setFetchStatus("ok");
    } else if (fallbackRate > 0) {
      setExchangeRate(fallbackRate);
      setFetchStatus("ok");
    } else {
      setFetchStatus("error");
    }

    setFetchingRate(false);
    setTimeout(() => setFetchStatus("idle"), 5000);
  };

  const handleOpenDay = async () => {
    setOpening(true);
    try {
      const res = await fetch("/api/backoffice/day-opening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workShiftId: openShiftId || undefined,
          exchangeRateBcv: exchangeRate,
        }),
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

  const canOpen = exchangeRate > 0 && !opening && !loadingRate;

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
            {openResult.opening.exchangeRateBcv && (
              <p className="text-sm text-muted-foreground">BCV Rate: Bs {openResult.opening.exchangeRateBcv}/USD</p>
            )}
            <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); setOpenResult(null); }}>{t("common.ok")}</Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This will open the work day. All previous working days must be closed first.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="bcv-rate">BCV Rate (Bs/USD)</Label>
              {loadingRate ? (
                <div className="h-9 animate-pulse rounded bg-muted" />
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="bcv-rate"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={exchangeRate || ""}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 60.00"
                    className="font-mono flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFetchRate}
                    disabled={fetchingRate}
                    className="shrink-0"
                  >
                    {fetchingRate ? "..." : "Fetch"}
                  </Button>
                </div>
              )}
              {fetchStatus === "ok" && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <ImCheckmark className="w-3 h-3" /> Rate updated
                </p>
              )}
              {fetchStatus === "error" && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <ImCross className="w-3 h-3" /> Could not fetch rates
                </p>
              )}
              {exchangeRate === 0 && !loadingRate && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <ImWarning className="w-3 h-3 shrink-0" />
                  Exchange rate must be set before opening the day.
                </p>
              )}
            </div>
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
              <Button onClick={handleOpenDay} disabled={!canOpen} className="gap-2">
                <ImCheckmark className="w-3 h-3" /> {opening ? t("common.loading") : t("reports.openDay")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
