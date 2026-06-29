"use client";
import { ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/useT";
import { useBilling } from "./BillingContext";
import { formatVes, formatUsd } from "@/libs/currency";

interface BillCardProps {
  order: any;
}

export default function BillCard({ order: o }: BillCardProps) {
  const { t } = useT();
  const {
    todayClosed,
    isTodayOrder,
    confirmPayment,
    openEdit,
    revertBill,
    cancelBill,
    openCreditNote,
  } = useBilling();

  const taxMap = new Map<string, number>();
  const rate = o.exchangeRateBcv || 1;
  for (const it of o.items || []) {
    for (const tx of it.taxBreakdown || [])
      taxMap.set(tx.name, (taxMap.get(tx.name) || 0) + tx.amount);
  }
  for (const tx of o.globalTaxBreakdown || [])
    taxMap.set(tx.name, (taxMap.get(tx.name) || 0) + tx.amount);

  return (
    <Card key={o._id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{o.customer?.name || t("billing.walkIn")}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(o.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              o.status === "paid"
                ? "bg-green-500/10 text-green-500"
                : "bg-yellow-500/10 text-yellow-500"
            }`}
          >
            {t(`common.${o.status}`)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {o.paymentMethod}
          </p>
          {o.invoiceNumber && (
            <span className="text-xs text-muted-foreground font-mono">
              # INV-{String(o.invoiceNumber).padStart(5, "0")}
            </span>
          )}
        </div>
        {/* Items list */}
        <div className="space-y-0.5">
          {(o.items || []).map((it: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{it.quantity}× {it.name}</span>
              <span>{formatVes((it.price || 0) * (it.quantity || 1) * rate)}</span>
            </div>
          ))}
        </div>

        {/* Creator / Register info */}
        {(o.createdBy || o.cashRegisterName) && (
          <p className="text-xs text-muted-foreground">
            🧑 {o.createdBy || "—"} · 🏪 {o.cashRegisterName || "—"}
          </p>
        )}
        {o.isDelivery && (
          <p className="text-xs text-muted-foreground">{t("billing.delivery")}</p>
        )}
        <div className="border-t pt-2 space-y-0.5 font-medium">
          {/* 1. Subtotal */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("billing.subtotal")}</span>
            <div className="text-right">
              <span>{formatVes(o.subtotal)}</span>
              {rate > 1 && o.subtotal > 0 && (
                <div className="text-[10px] text-muted-foreground/60">{formatUsd(o.subtotal / rate)}</div>
              )}
            </div>
          </div>

          {/* 2. Charges */}
          {(o.orderCharges || []).map((ch: any) => (
            <div key={ch.name} className="flex justify-between text-sm text-muted-foreground">
              <span>{ch.name}</span>
              <div className="text-right">
                <span>{formatVes(ch.amount)}</span>
                {rate > 1 && ch.amount > 0 && (
                  <div className="text-[10px] text-muted-foreground/60">{formatUsd(ch.amount / rate)}</div>
                )}
              </div>
            </div>
          ))}
          {(!o.orderCharges || o.orderCharges.length === 0) && o.serviceCharge > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("billing.service")}</span>
              <div className="text-right">
                <span>{formatVes(o.serviceCharge)}</span>
                {rate > 1 && (
                  <div className="text-[10px] text-muted-foreground/60">{formatUsd(o.serviceCharge / rate)}</div>
                )}
              </div>
            </div>
          )}
          {(!o.orderCharges || o.orderCharges.length === 0) && o.deliveryCost > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("billing.delivery")}</span>
              <div className="text-right">
                <span>{formatVes(o.deliveryCost)}</span>
                {rate > 1 && (
                  <div className="text-[10px] text-muted-foreground/60">{formatUsd(o.deliveryCost / rate)}</div>
                )}
              </div>
            </div>
          )}

          {/* 3. Taxes */}
          {taxMap.size > 0
            ? Array.from(taxMap.entries()).map(([name, amount]) => (
                <div key={name} className="flex justify-between text-sm text-muted-foreground">
                  <span>{name}</span>
                  <div className="text-right">
                    <span>{formatVes(amount)}</span>
                    {rate > 1 && amount > 0 && (
                      <div className="text-[10px] text-muted-foreground/60">{formatUsd(amount / rate)}</div>
                    )}
                  </div>
                </div>
              ))
            : (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("billing.iva")}</span>
                <div className="text-right">
                  <span>{formatVes(o.totalTax || 0)}</span>
                  {rate > 1 && (o.totalTax || 0) > 0 && (
                    <div className="text-[10px] text-muted-foreground/60">{formatUsd((o.totalTax || 0) / rate)}</div>
                  )}
                </div>
              </div>
            )}

          {/* 4. Total */}
          {o.paymentData &&
            Object.keys(o.paymentData).length > 0 &&
            o.status === "paid" && (
              <div className="pt-1 mt-1 text-xs text-muted-foreground space-y-0.5">
                {Object.entries(o.paymentData)
                  .filter(([_, v]) => v)
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span>{val as string}</span>
                    </div>
                  ))}
              </div>
            )}

          {/* Total */}
          <div className="flex justify-between text-base font-bold text-golden border-t pt-1 mt-1">
            <span>{t("billing.total")}</span>
            <div className="text-right">
              <span>{formatVes(o.total)}</span>
              {o.totalUsdRef > 0 && o.exchangeRateBcv > 0 && (
                <div className="text-xs text-muted-foreground">
                  {formatUsd(o.totalUsdRef)}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Actions */}
        {o.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => confirmPayment(o)}
              className="gap-1"
            >
              <ImCheckmark className="w-3 h-3" />{" "}
              {t("billing.confirmPayment")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => openEdit(o)}>
              {t("common.edit")}
            </Button>
            {isTodayOrder(o) && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive ml-auto"
                onClick={() => cancelBill(o)}
              >
                {t("common.cancel")}
              </Button>
            )}
          </div>
        )}
        {o.status === "paid" && !todayClosed && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => revertBill(o)}
              className="gap-1 text-xs"
            >
              {t("billing.revert")}
            </Button>
          </div>
        )}
        {o.status === "paid" && todayClosed && (
          <div className="flex pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreditNote(o)}
              className="gap-1 text-xs"
            >
              {t("billing.issueCreditNote")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
