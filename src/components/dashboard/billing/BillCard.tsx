"use client";
import { ImCheckmark } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/useT";
import { useBilling } from "./BillingContext";

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
          <p className="text-muted-foreground">
            {o.items?.length || 0} {t("billing.items")} · {o.paymentMethod}
          </p>
          {o.invoiceNumber && (
            <span className="text-xs text-muted-foreground font-mono">
              # INV-{String(o.invoiceNumber).padStart(5, "0")}
            </span>
          )}
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
          {(o.orderCharges || []).map((ch: any) => (
            <div
              key={ch.name}
              className="flex justify-between text-xs text-muted-foreground"
            >
              <span>{ch.name}</span>
              <span>${Number(ch.amount).toFixed(2)}</span>
            </div>
          ))}
          {(!o.orderCharges || o.orderCharges.length === 0) &&
            o.serviceCharge > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("billing.service")}</span>
                <span>${Number(o.serviceCharge).toFixed(2)}</span>
              </div>
            )}
          {(!o.orderCharges || o.orderCharges.length === 0) &&
            o.deliveryCost > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("billing.delivery")}</span>
                <span>${Number(o.deliveryCost).toFixed(2)}</span>
              </div>
            )}
          {taxMap.size > 0 &&
            Array.from(taxMap.entries()).map(([name, amount]) => (
              <div
                key={name}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{name}</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            ))}
          {o.paymentData &&
            Object.keys(o.paymentData).length > 0 &&
            o.status === "paid" && (
              <div className="border-t pt-1 mt-1 text-xs text-muted-foreground space-y-0.5">
                {Object.entries(o.paymentData)
                  .filter(([_, v]) => v)
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span>{val as string}</span>
                    </div>
                  ))}
              </div>
            )}
          <div className="flex justify-between text-golden">
            <span>{t("billing.total")}</span>
            <span>${o.total?.toFixed(2)}</span>
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
