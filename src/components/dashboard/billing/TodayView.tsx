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
}: TodayViewProps) {
  const { t } = useT();

  const paidOrders = displayOrders.filter((o) => o.status === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalTax = paidOrders.reduce((s, o) => s + (o.totalTax || 0), 0);
  const totalCharges = paidOrders.reduce((s, o) => s + (o.totalCharge || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.totalRevenue") || "Revenue"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.bills")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{displayOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.avgTicket") || "Avg ticket"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">${avgTicket.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{t("billing.taxesAndCharges") || "Taxes + charges"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">${(totalTax + totalCharges).toFixed(2)}</p>
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
