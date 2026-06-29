"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useT } from "@/i18n/useT";
import { formatVes, formatUsd } from "@/libs/currency";
import BillCard from "./BillCard";

interface TodayViewProps {
  orders: any[];
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  displayOrders: any[];
  paginated: any[];
  unclosedDays: string[];
  todayLocal: string;
  todaySearch: string;
  setTodaySearch: (s: string) => void;
  todayInvNum: string;
  setTodayInvNum: (s: string) => void;
  bcvRate: number;
}

export default function TodayView({
  page,
  setPage,
  totalPages,
  paginated,
  displayOrders,
  unclosedDays,
  todayLocal,
  todaySearch,
  setTodaySearch,
  todayInvNum,
  setTodayInvNum,
  bcvRate,
}: TodayViewProps) {
  const { t } = useT();

  const paidOrders = displayOrders.filter((o) => o.status === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalUsd = paidOrders.reduce((s, o) => s + (o.totalUsdRef || 0), 0);

  // Aggregate charges by name
  const chargesMap = new Map<string, number>();
  for (const o of paidOrders) {
    for (const ch of o.orderCharges || []) {
      chargesMap.set(ch.name, (chargesMap.get(ch.name) || 0) + (ch.amount || 0));
    }
    // Legacy fields
    if ((!o.orderCharges || o.orderCharges.length === 0) && o.serviceCharge > 0) {
      chargesMap.set("Servicio", (chargesMap.get("Servicio") || 0) + o.serviceCharge);
    }
    if ((!o.orderCharges || o.orderCharges.length === 0) && o.deliveryCost > 0) {
      chargesMap.set("Delivery", (chargesMap.get("Delivery") || 0) + o.deliveryCost);
    }
  }

  // Aggregate taxes by name
  const taxesMap = new Map<string, number>();
  for (const o of paidOrders) {
    for (const tx of o.globalTaxBreakdown || []) {
      taxesMap.set(tx.name, (taxesMap.get(tx.name) || 0) + (tx.amount || 0));
    }
    for (const it of o.items || []) {
      for (const tx of it.taxBreakdown || []) {
        taxesMap.set(tx.name, (taxesMap.get(tx.name) || 0) + (tx.amount || 0));
      }
    }
    // Fallback if no tax breakdown
    if (taxesMap.size === 0 && (o.totalTax || 0) > 0) {
      taxesMap.set("IVA", (taxesMap.get("IVA") || 0) + (o.totalTax || 0));
    }
  }

  return (
    <>
      {/* Unclosed days banner */}
      {unclosedDays.length > 0 &&
        unclosedDays.some((d) => d !== todayLocal) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm space-y-1">
            <p className="font-medium text-amber-700 dark:text-amber-300">
              ⏳{" "}
              {t("reports.previousDayNotClosed") || "Previous days not closed"}
            </p>
            <p className="text-muted-foreground">
              {unclosedDays.filter((d) => d !== todayLocal).join(", ")}
              {" — "}
              {t("reports.closePreviousFirst") ||
                "Close them from Reports → Daily Operations → Close Day"}
            </p>
          </div>
        )}

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Income */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.totalRevenue") || "Revenue"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatVes(totalRevenue)}</p>
            {totalUsd > 0 && bcvRate > 0 && (
              <p className="text-xs text-muted-foreground">{formatUsd(totalUsd)}</p>
            )}
          </CardContent>
        </Card>
        {/* Bill Count */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.bills")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{displayOrders.length}</p>
          </CardContent>
        </Card>
        {/* Service Charges Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("reports.charges") || "Charges"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {chargesMap.size === 0 ? (
              <p className="text-xs text-muted-foreground">—</p>
            ) : (
              Array.from(chargesMap.entries()).map(([name, amount]) => (
                <div key={name} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-medium">{formatVes(amount)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        {/* Taxes Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("reports.totalTax") || "Taxes"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {taxesMap.size === 0 ? (
              <p className="text-xs text-muted-foreground">—</p>
            ) : (
              Array.from(taxesMap.entries()).map(([name, amount]) => (
                <div key={name} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-medium">{formatVes(amount)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder={t("common.search")}
          value={todaySearch}
          onChange={(e) => {
            setTodaySearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs h-8 text-xs"
        />
        <Input
          placeholder={`# ${t("creditNotes.originalInvoice")}`}
          value={todayInvNum}
          onChange={(e) => {
            setTodayInvNum(e.target.value);
            setPage(1);
          }}
          className="w-36 h-8 text-xs"
        />
        <span className="text-xs text-muted-foreground">
          {displayOrders.length} {t("billing.bills")}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {paginated.length === 0 ? (
          <p className="text-muted-foreground col-span-2">
            {t("common.noData")}
          </p>
        ) : (
          paginated.map((o) => <BillCard key={o._id} order={o} />)
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {displayOrders.length} {t("billing.bills")}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
