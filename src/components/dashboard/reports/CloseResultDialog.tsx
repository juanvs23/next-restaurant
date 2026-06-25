"use client";
import { ImCheckmark, ImWarning } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface CloseResultDialogProps {
  closeDateResult: any;
  closeDate: string | null;
  onClose: () => void;
}

export default function CloseResultDialog({ closeDateResult, closeDate, onClose }: CloseResultDialogProps) {
  const { t } = useT();

  return (
    <Dialog open={!!closeDateResult} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-popover">
        <DialogHeader><DialogTitle>{t("reports.closeDayTitle")} — {closeDate}</DialogTitle></DialogHeader>

        {closeDateResult?.error ? (
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-3">
              <ImWarning className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">{closeDateResult.error}</p>
                {closeDateResult.reason && <p className="text-sm text-muted-foreground mt-1">{closeDateResult.reason}</p>}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={onClose}>{t("common.ok")}</Button>
          </div>
        ) : closeDateResult?.success ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <ImCheckmark className="w-5 h-5" /> {closeDate} {t("reports.closed")}
            </div>
            <div className="border rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>{t("reports.orders")}</span><span className="font-medium">{closeDateResult.closing.summary.totalOrders}</span></div>
              <div className="flex justify-between"><span>{t("reports.revenue")}</span><span className="font-medium">${closeDateResult.closing.summary.totalRevenue.toFixed(2)}</span></div>
            </div>
            <Button variant="outline" className="w-full" onClick={onClose}>{t("common.ok")}</Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
