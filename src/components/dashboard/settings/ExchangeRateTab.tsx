"use client";
import { useEffect, useState } from "react";
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
  const [fetched, setFetched] = useState(false);

  const handleFetch = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/backoffice/exchange-rate", { method: "POST" });
      const data = await res.json();
      setForm({
        ...form,
        exchangeRateBcv: data.exchangeRateBcv ?? form.exchangeRateBcv,
        exchangeRateUsdt: data.exchangeRateUsdt ?? form.exchangeRateUsdt,
      });
      setFetched(true);
      setTimeout(() => setFetched(false), 3000);
    } catch {}
    setFetching(false);
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
      <Button onClick={handleFetch} disabled={fetching} variant="outline" size="sm" className="gap-2">
        {fetched ? <><ImCheckmark /> Actualizado</> : fetching ? "Consultando..." : "Actualizar tasas desde dolarapi.com"}
      </Button>
    </div>
  );
}
