"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useT } from "@/i18n/useT";
import { formatVes } from "@/libs/currency";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orders: any[];
}

export default function DayOrdersDialog({ open, onOpenChange, orders }: Props) {
  const { t } = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {orders.length > 0
              ? `${t("billing.bills")} — ${new Date(orders[0].createdAt).toLocaleDateString()}`
              : t("billing.bills")}
          </DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{t("billing.customer")}</TableHead>
              <TableHead>{t("billing.paymentMethod")}</TableHead>
              <TableHead className="text-right">{t("billing.subtotal")}</TableHead>
              <TableHead className="text-right">{t("billing.total")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-mono text-xs">
                    # INV-{String(o.invoiceNumber || "").padStart(5, "0")}
                  </TableCell>
                  <TableCell>{o.customer?.name || t("billing.walkIn")}</TableCell>
                  <TableCell>{o.paymentMethod}</TableCell>
                  <TableCell className="text-right">{o.subtotal ? formatVes(o.subtotal) : "—"}</TableCell>
                  <TableCell className="text-right font-medium">{o.total ? formatVes(o.total) : "—"}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      o.status === "paid" ? "bg-green-500/10 text-green-500" :
                      o.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>{o.status}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close") || "Cerrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
