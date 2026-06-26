"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useT } from "@/i18n/useT";

interface Props {
  form: any;
  setForm: (f: any) => void;
}

export function ExchangeRateTab({ form, setForm }: Props) {
  const { t } = useT();
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const handleFetch = async () => {
    setFetching(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/backoffice/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.exchangeRateBcv || data.exchangeRateUsdt) {
        setForm({
          ...form,
          exchangeRateBcv: data.exchangeRateBcv ?? form.exchangeRateBcv,
          exchangeRateUsdt: data.exchangeRateUsdt ?? form.exchangeRateUsdt,
        });
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setFetching(false);
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label>{t("settings.exchangeRateBcv") || "Tasa BCV (Bs/USD)"}</Label>
          <Input type="number" step="0.01" min="0"
            value={form.exchangeRateBcv ?? 0}
            onChange={(e) => setForm({ ...form, exchangeRateBcv: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="grid gap-1">
          <Label>{t("settings.exchangeRateUsdt") || "Tasa USDT (Bs/USDT)"}</Label>
          <Input type="number" step="0.01" min="0"
            value={form.exchangeRateUsdt ?? 0}
            onChange={(e) => setForm({ ...form, exchangeRateUsdt: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleFetch} disabled={fetching} variant="outline" size="sm" className="gap-2">
          {fetching ? "Consultando..." : "Actualizar desde dolarapi.com"}
        </Button>
        {status === "ok" && <span className="text-xs text-green-500 flex items-center gap-1"><ImCheckmark /> Tasas actualizadas</span>}
        {status === "error" && <span className="text-xs text-red-500 flex items-center gap-1"><ImCross /> No se pudieron obtener las tasas</span>}
      </div>
      <p className="text-xs text-muted-foreground">Las tasas se guardan al hacer clic en "Guardar cambios" abajo.</p>
    </div>
  );
}
