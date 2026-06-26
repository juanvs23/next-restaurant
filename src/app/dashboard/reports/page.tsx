"use client";
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross, ImWarning } from "react-icons/im";
import { useT } from "@/i18n/useT";
import { formatVes } from "@/libs/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

import OpenDayDialog from "@/components/dashboard/reports/OpenDayDialog";
import CashAuditDialog from "@/components/dashboard/reports/CashAuditDialog";
import ManualCloseDialog from "@/components/dashboard/reports/ManualCloseDialog";
import CloseResultDialog from "@/components/dashboard/reports/CloseResultDialog";

export default function ReportsPage() {
  const { t } = useT();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bcvRate, setBcvRate] = useState(0);

  useEffect(() => {
    fetch("/api/backoffice/exchange-rate").then((r) => r.json()).then((d) => {
      if (d.exchangeRateBcv) setBcvRate(d.exchangeRateBcv);
    }).catch(() => {});
  }, []);

  const toVes = (usd: number) => bcvRate > 0 ? bcvRate * usd : usd;

  // Today's close dialog
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeResult, setCloseResult] = useState<any>(null);
  const [closing, setClosing] = useState(false);

  // Dialog open states
  const [openOpen, setOpenOpen] = useState(false);
  const [caOpen, setCaOpen] = useState(false);
  const [manualCloseOpen, setManualCloseOpen] = useState(false);

  // Close by date
  const [closeDate, setCloseDate] = useState<string | null>(null);
  const [closeDateLoading, setCloseDateLoading] = useState(false);
  const [closeDateResult, setCloseDateResult] = useState<any>(null);

  const fetchReports = () => {
    setLoading(true);
    fetch(`/api/backoffice/reports?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [year, month]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const isToday =
    year === now.getFullYear() && month === now.getMonth() + 1;
  const isTodayClosed = data?.dayStatus?.isClosed;

  const handleCloseDay = async () => {
    setClosing(true);
    try {
      const res = await fetch("/api/backoffice/reports/close", { method: "POST" });
      const result = await res.json();
      if (!res.ok) {
        setCloseResult({ error: result.error });
      } else {
        setCloseResult(result);
      }
      fetchReports();
    } catch {
      setCloseResult({ error: "Failed to close day" });
    }
    setClosing(false);
  };

  const closeDayByDate = async (date: string) => {
    setCloseDate(date);
    setCloseDateResult(null);
    setCloseDateLoading(true);
    try {
      const res = await fetch("/api/backoffice/reports/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const result = await res.json();
      if (!res.ok) setCloseDateResult({ error: result.error, reason: result.reason });
      else setCloseDateResult({ success: true, closing: result.closing });
      fetchReports();
    } catch {
      setCloseDateResult({ error: "Failed to close day" });
    }
    setCloseDateLoading(false);
  };

  if (loading && !data) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  const closedDates = new Set(data?.closings?.dates || []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
        <div className="flex items-center gap-3">
          <div className="grid gap-1">
            <Label className="text-xs">{t("reports.month")}</Label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-background border border-input rounded px-3 py-2 text-sm h-9">
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1">
            <Label className="text-xs">{t("reports.year")}</Label>
            <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="w-20 h-9" />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("reports.orders")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.summary?.totalOrders ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("reports.revenue")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">{formatVes(toVes(data?.summary?.totalRevenue ?? 0))}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("reports.avgTicket")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatVes(toVes(data?.summary?.avgTicket ?? 0))}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("reports.totalTax")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-600">{formatVes(toVes(data?.summary?.totalTax ?? 0))}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("reports.charges")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-blue-600">{formatVes(toVes(data?.summary?.totalCharges ?? 0))}</p></CardContent>
        </Card>
      </div>

      {/* Daily breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("reports.dailyOperations")}</CardTitle>
            <div className="flex items-center gap-2">
              {isToday && data?.dayStatus?.isOpen && !data?.dayStatus?.isClosed && (
                <>
                  <Button onClick={() => setCaOpen(true)} size="sm" variant="outline" className="gap-2 text-xs">
                    {t("reports.cashAudit")}
                  </Button>
                  <Button onClick={() => setCloseOpen(true)} size="sm" variant="outline" className="gap-2">
                    <ImCheckmark className="w-3 h-3" /> {t("reports.closeDay")}
                  </Button>
                </>
              )}
              {isToday && !data?.dayStatus?.isOpen && !data?.dayStatus?.isClosed && (
                <Button onClick={() => setOpenOpen(true)} size="sm" className="gap-2">
                  <ImCheckmark className="w-3 h-3" /> {t("reports.openDay")}
                </Button>
              )}
              <Button onClick={() => setManualCloseOpen(true)} size="sm" variant="outline" className="gap-2 text-xs">
                {t("reports.closeDay")}
              </Button>
              {isToday && data?.dayStatus?.isClosed && (
                <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full font-medium">
                  ✓ {t("reports.closed")}
                </span>
              )}
              {isToday && data?.dayStatus?.isOpen && !data?.dayStatus?.isClosed && (
                <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-full">
                  {t("reports.open")} · {data.dayStatus.openedBy}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead className="text-right">{t("reports.orders")}</TableHead>
                <TableHead className="text-right">{t("common.subtotal")}</TableHead>
                <TableHead className="text-right">{t("reports.charges")}</TableHead>
                <TableHead className="text-right">{t("reports.totalTax")}</TableHead>
                <TableHead className="text-right">{t("reports.revenue")}</TableHead>
                <TableHead className="text-right">{t("reports.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.byDay ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {t("reports.noPaidOrders")}
                  </TableCell>
                </TableRow>
              ) : (
                (data?.byDay ?? []).map((d: any) => (
                  <TableRow key={d._id}>
                    <TableCell>{new Date(d._id + "T00:00:00").toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{d.orders}</TableCell>
                    <TableCell className="text-right">{formatVes(toVes(d.subtotal))}</TableCell>
                    <TableCell className="text-right">{formatVes(toVes(d.charges))}</TableCell>
                    <TableCell className="text-right">{formatVes(toVes(d.tax))}</TableCell>
                    <TableCell className="text-right font-medium">{formatVes(toVes(d.revenue))}</TableCell>
                    <TableCell className="text-right">
                      {closedDates.has(d._id) ? (
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">{t("reports.closed")}</span>
                      ) : d._id === now.toISOString().slice(0, 10) ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-6 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => closeDayByDate(d._id)} disabled={closeDateLoading && closeDate === d._id}>
                          {closeDateLoading && closeDate === d._id ? "..." : t("reports.close")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment type breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("reports.byPaymentType")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reports.method")}</TableHead>
                  <TableHead className="text-right">{t("reports.orders")}</TableHead>
                  <TableHead className="text-right">{t("common.total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.byPaymentType ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">{t("reports.noData")}</TableCell>
                  </TableRow>
                ) : (
                  (data?.byPaymentType ?? []).map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell className="capitalize">{p._id}</TableCell>
                      <TableCell className="text-right">{p.count}</TableCell>
                      <TableCell className="text-right font-medium">{formatVes(toVes(p.total))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader><CardTitle>{t("reports.topProducts")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reports.product")}</TableHead>
                  <TableHead className="text-right">{t("reports.qty")}</TableHead>
                  <TableHead className="text-right">{t("reports.revenue")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {(data?.topProducts ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">{t("reports.noData")}</TableCell>
                  </TableRow>
                ) : (
                  (data?.topProducts ?? []).map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell>{p._id}</TableCell>
                      <TableCell className="text-right">{p.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{formatVes(toVes(p.revenue))}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Extracted dialogs */}
      <OpenDayDialog
        open={openOpen}
        onOpenChange={setOpenOpen}
        onClose={fetchReports}
        onCloseDate={closeDayByDate}
      />
      <CashAuditDialog
        open={caOpen}
        onOpenChange={setCaOpen}
      />
      <ManualCloseDialog
        open={manualCloseOpen}
        onOpenChange={setManualCloseOpen}
        onClose={fetchReports}
      />
      <CloseResultDialog
        closeDateResult={closeDateResult}
        closeDate={closeDate}
        onClose={() => setCloseDateResult(null)}
      />

      {/* Close Day dialog (today) */}
      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent className="sm:max-w-md bg-popover">
          <DialogHeader><DialogTitle>{t("reports.closeDayTitle")} — {now.toLocaleDateString()}</DialogTitle></DialogHeader>

          {closeResult?.error ? (
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-3">
                <ImWarning className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">{closeResult.error}</p>
                  {closeResult.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{closeResult.reason}</p>
                  )}
                  {closeResult.blockers?.pendingBills > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      {closeResult.blockers.pendingBills} pending bill(s) also need resolution
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setCloseOpen(false); setCloseResult(null); }}>{t("common.ok")}</Button>
            </div>
          ) : closeResult?.closing ? (
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <ImCheckmark className="w-5 h-5" /> Day closed successfully
              </div>
              <div className="border rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>{t("reports.orders")}</span><span className="font-medium">{closeResult.closing.summary.totalOrders}</span></div>
                <div className="flex justify-between"><span>{t("reports.revenue")}</span><span className="font-medium">{formatVes(toVes(closeResult.closing.summary.totalRevenue))}</span></div>
                <div className="flex justify-between"><span>{t("reports.avgTicket")}</span><span className="font-medium">{formatVes(toVes(closeResult.closing.summary.avgTicket))}</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setCloseOpen(false); setCloseResult(null); }}>{t("common.ok")}</Button>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                All comandas and pending bills must be resolved before closing the day.
                Once closed, no further changes can be made to today's records.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCloseOpen(false)} className="gap-2"><ImCross /> {t("common.cancel")}</Button>
                <Button onClick={handleCloseDay} disabled={closing} className="gap-2">
                  <ImCheckmark className="w-3 h-3" /> {closing ? t("common.loading") : t("reports.closeDay")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
