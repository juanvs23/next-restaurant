"use client";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/useT";
import CreditNoteDialog from "./CreditNoteDialog";
import { formatVes, formatUsd } from "@/libs/currency";

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: any;
  onRefresh?: () => void;
}

export default function InvoiceDetailDialog({ open, onOpenChange, order, onRefresh }: InvoiceDetailDialogProps) {
  const { t } = useT();
  const [cnOpen, setCnOpen] = useState(false);

  if (!order) return null;

  const rate = order.exchangeRateBcv || 1;
  const toVes = (usd: number) => usd * rate;

  const taxMap = new Map<string, number>();
  for (const it of order.items || []) {
    for (const tx of it.taxBreakdown || []) taxMap.set(tx.name, (taxMap.get(tx.name) || 0) + tx.amount);
  }
  for (const tx of order.globalTaxBreakdown || []) taxMap.set(tx.name, (taxMap.get(tx.name) || 0) + tx.amount);

  const handleCreditNoteIssued = () => {
    setCnOpen(false);
    onRefresh?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-popover max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("billing.invoiceDetails")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground"># {t("creditNotes.originalInvoice")}</Label>
                <p className="font-mono">INV-{String(order.invoiceNumber || "").padStart(5, "0")}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("common.date")}</Label>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("billing.customer")}</Label>
                <p>{order.customer?.name || t("billing.walkIn")}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("billing.paymentMethod")}</Label>
                <p className="capitalize">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">{t("billing.itemsList")}</Label>
              <div className="border rounded-lg divide-y">
                {(order.items || []).length === 0 && (
                  <p className="text-muted-foreground text-xs p-2">{t("common.noData")}</p>
                )}
                {(order.items || []).map((it: any, i: number) => (
                  <div key={i} className="flex justify-between px-3 py-1.5 text-sm">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-medium">{formatVes(toVes(it.price * it.quantity))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges */}
            {(order.orderCharges || []).length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t("settings.charges")}</Label>
                <div className="border rounded-lg divide-y">
                  {(order.orderCharges || []).map((ch: any, i: number) => (
                    <div key={i} className="flex justify-between px-3 py-1.5 text-sm">
                      <span>{ch.name}</span>
                      <span>{formatVes(toVes(Number(ch.amount)))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tax breakdown */}
            {taxMap.size > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t("billing.iva")}</Label>
                <div className="border rounded-lg divide-y">
                  {Array.from(taxMap.entries()).map(([name, amount]) => (
                    <div key={name} className="flex justify-between px-3 py-1.5 text-sm">
                      <span>{name}</span>
                      <span>{formatVes(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="border-t pt-3 space-y-1 font-medium">
              <div className="flex justify-between text-sm">
                <span>{t("billing.subtotal")}</span>
                <span>{formatVes(order.subtotal)}</span>
              </div>
              {(order.orderCharges || []).length > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("reports.charges")}</span>
                  <span>{formatVes(order.totalCharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>{t("billing.iva")}</span>
                <span>{formatVes(order.totalTax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-golden border-t pt-2">
                <span>{t("billing.total")}</span>
                <div className="text-right">
                  <span>{formatVes(order.total)}</span>
                  {order.totalUsdRef > 0 && order.exchangeRateBcv > 0 && (
                    <div className="text-xs font-normal text-muted-foreground">
                      {formatUsd(order.totalUsdRef)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment data */}
            {order.paymentData && Object.keys(order.paymentData).filter(k => order.paymentData[k]).length > 0 && (
              <div className="border-t pt-3">
                <Label className="text-xs text-muted-foreground mb-1 block">{t("billing.paymentDetails")}</Label>
                <div className="border rounded-lg divide-y">
                  {Object.entries(order.paymentData).filter(([_, v]) => v).map(([key, val]) => (
                    <div key={key} className="flex justify-between px-3 py-1.5 text-sm">
                      <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
                <ImCross /> {t("common.close")}
              </Button>
            </div>
            {order.status === "paid" && (
              <Button onClick={() => setCnOpen(true)} className="gap-2">
                {t("billing.issueCreditNote")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreditNoteDialog
        open={cnOpen}
        onOpenChange={setCnOpen}
        order={order}
        onIssued={handleCreditNoteIssued}
      />
    </>
  );
}
