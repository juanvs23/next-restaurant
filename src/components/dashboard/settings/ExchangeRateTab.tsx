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

const API_URLS = [
  "https://ve.dolarapi.com/v1/dolares",
  "https://pydolarve.com/api/dolar?moneda=usd",
  "https://open.er-api.com/v6/latest/USD",
];

export function ExchangeRateTab({ form, setForm }: Props) {
  const { t } = useT();
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const handleFetch = async () => {
    setFetching(true);
    setStatus("idle");

    let bcv = 0;
    let usdt = 0;
    let fallbackRate = 0;

    for (const url of API_URLS) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const data = await res.json();

        if (Array.isArray(data)) {
          const oficial = data.find((d: any) => d.fuente === "oficial" || d._id === "bcv");
          const paralelo = data.find((d: any) => d.fuente === "paralelo" || d._id === "paralelo");
          bcv = oficial?.promedio || oficial?.venta || bcv;
          usdt = paralelo?.promedio || paralelo?.venta || usdt;
        } else if (data.rates?.VES) {
          fallbackRate = data.rates.VES;
        }
        if (bcv > 0 || usdt > 0) break;
      } catch {
        continue;
      }
    }

    if (bcv > 0 || usdt > 0) {
      setForm({ ...form, exchangeRateBcv: bcv, exchangeRateUsdt: usdt || bcv });
      setStatus("ok");
    } else if (fallbackRate > 0) {
      setForm({ ...form, exchangeRateBcv: fallbackRate, exchangeRateUsdt: fallbackRate });
      setStatus("ok");
    } else {
      setStatus("error");
    }

    setFetching(false);
    setTimeout(() => setStatus("idle"), 5000);
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
          {fetching ? "Consultando..." : "Obtener tasas actuales"}
        </Button>
        {status === "ok" && <span className="text-xs text-green-500 flex items-center gap-1"><ImCheckmark /> Tasas cargadas — guardá los cambios abajo</span>}
        {status === "error" && <span className="text-xs text-red-500 flex items-center gap-1"><ImCross /> No se pudieron obtener las tasas</span>}
      </div>
      <p className="text-xs text-muted-foreground">Las tasas se guardan al hacer clic en "Guardar cambios" abajo.</p>
    </div>
  );
}
