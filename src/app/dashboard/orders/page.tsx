"use client";
import { useEffect, useState } from "react";
import { ImPlus } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/useT";
import NewBillDialog from "@/components/dashboard/billing/NewBillDialog";
import EditBillDialog from "@/components/dashboard/billing/EditBillDialog";
import CreditNoteDialog from "@/components/dashboard/billing/CreditNoteDialog";
import InvoiceDetailDialog from "@/components/dashboard/billing/InvoiceDetailDialog";
import DayOrdersDialog from "@/components/dashboard/billing/DayOrdersDialog";
import TodayView from "@/components/dashboard/billing/TodayView";
import HistoryView from "@/components/dashboard/billing/HistoryView";
import { BillingProvider } from "@/components/dashboard/billing/BillingContext";

const TABS = ["today", "history"];
const PER_PAGE = 20;

// Shared helper to compute timezone offset in ms
function tzOffsetMs(tz: string) {
  const sign = tz.startsWith("-") ? -1 : 1;
  const [h, m] = tz.replace(/[+-]/, "").split(":").map(Number);
  return sign * (h * 3600 + m * 60) * 1000;
}

export default function OrdersPage() {
  const { t } = useT();
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tz, setTz] = useState("-04:00");
  const [bcvRate, setBcvRate] = useState(0);

  useEffect(() => {
    fetch("/api/backoffice/config").then((r) => r.json()).then((cfg) => {
      if (cfg?.timezone) setTz(cfg.timezone);
    }).catch(() => {});
    fetch("/api/backoffice/exchange-rate").then((r) => r.json()).then((d) => {
      if (d.exchangeRateBcv) setBcvRate(d.exchangeRateBcv);
    }).catch(() => {});
  }, []);

  const todayLocal = (() => {
    const now = new Date();
    return new Date(now.getTime() + tzOffsetMs(tz)).toISOString().slice(0, 10);
  })();

  // Dialog state
  const [newBillOpen, setNewBillOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<any>(null);
  const [cnOpen, setCnOpen] = useState(false);
  const [cnOrder, setCnOrder] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [detailDayOrders, setDetailDayOrders] = useState<any[]>([]);
  const [detailDayOpen, setDetailDayOpen] = useState(false);

  // History filters
  const [closedDays, setClosedDays] = useState<any[]>([]);
  const [hDateFrom, setHDateFrom] = useState("");
  const [hDateTo, setHDateTo] = useState("");
  const [hSearch, setHSearch] = useState("");
  const [hInvNum, setHInvNum] = useState("");
  // Today state
  const [todayClosed, setTodayClosed] = useState(false);
  const [unclosedDays, setUnclosedDays] = useState<string[]>([]);
  const [todaySearch, setTodaySearch] = useState("");
  const [todayInvNum, setTodayInvNum] = useState("");

  const fetchOrders = (params?: string) => {
    setLoading(true);
    fetch(`/api/backoffice/orders${params || ""}`).then((r) => r.json()).then((d) => {
      setOrders(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  // Today: load unclosed orders
  useEffect(() => {
    if (tab !== 0) return;
    fetch("/api/backoffice/day-closings").then((r) => r.json()).then((closed) => {
      const closedDates = new Set(closed.map((c: any) => c.date));
      setTodayClosed(closedDates.has(todayLocal));
      fetch("/api/backoffice/orders?unclosedOnly=true").then((r) => r.json()).then((orders) => {
        setOrders(orders);
        const dates = new Set<string>();
        orders.forEach((o: any) => {
          const localDate = new Date(new Date(o.createdAt).getTime() + tzOffsetMs(tz)).toISOString().slice(0, 10);
          if (!closedDates.has(localDate)) dates.add(localDate);
        });
        setUnclosedDays(Array.from(dates).sort());
        setLoading(false);
      }).catch(() => setLoading(false));
    }).catch(() => fetchOrders(`?dateFrom=${todayLocal}&dateTo=${todayLocal}`));
  }, [tab, todayLocal]);

  // History: load closed days
  useEffect(() => {
    if (tab !== 1) return;
    fetch("/api/backoffice/day-closings").then((r) => r.json()).then((days) => {
      setClosedDays(days);
      if (days.length > 0) {
        const latest = days[0].date;
        setHDateFrom(latest);
        setHDateTo(latest);
        fetchOrders(`?dateFrom=${latest}&dateTo=${latest}`);
      } else setLoading(false);
    }).catch(() => setLoading(false));
  }, [tab]);

  const handleHistorySearch = () => {
    if (!hDateFrom) return;
    const p = new URLSearchParams({ dateFrom: hDateFrom });
    if (hDateTo) p.set("dateTo", hDateTo);
    else p.set("dateTo", hDateFrom);
    if (hSearch) p.set("search", hSearch);
    if (hInvNum) p.set("invoiceNumber", hInvNum);
    fetchOrders("?" + p.toString());
    setPage(1);
  };

  const handleHistoryReset = () => {
    setHSearch("");
    setHInvNum("");
    if (closedDays.length === 0) return;
    const d = closedDays[0].date;
    setHDateFrom(d);
    setHDateTo(d);
    fetchOrders(`?dateFrom=${d}&dateTo=${d}`);
  };

  const apiFetch = async (id: string, body: any) =>
    fetch(`/api/backoffice/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const comandaFetch = async (id: string, body: any) =>
    fetch(`/api/backoffice/comandas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const confirmPayment = async (bill: any) => {
    await apiFetch(bill._id, { status: "paid" });
    if (bill.comandaId) await comandaFetch(bill.comandaId, { status: "closed" });
    fetchOrders(tab === 0 ? "?unclosedOnly=true" : "");
  };

  const cancelBill = async (bill: any) => {
    await apiFetch(bill._id, { status: "cancelled" });
    if (bill.comandaId) await comandaFetch(bill.comandaId, { status: "rejected" });
    fetchOrders(tab === 0 ? "?unclosedOnly=true" : "");
  };

  const revertBill = async (bill: any) => {
    await apiFetch(bill._id, { status: "pending" });
    if (bill.comandaId) await comandaFetch(bill.comandaId, { status: "open" });
    fetchOrders("?unclosedOnly=true");
  };

  const isTodayOrder = (bill: any) => {
    const billLocal = new Date(new Date(bill.createdAt).getTime() + tzOffsetMs(tz)).toISOString().slice(0, 10);
    return billLocal === todayLocal;
  };

  const openEdit = (bill: any) => { setEditingBill(bill); setEditOpen(true); };
  const openCreditNote = (order: any) => { setCnOrder(order); setCnOpen(true); };
  const handleDetail = (order: any) => {
    setDetailOrder(order);
    setDetailOpen(true);
  };

  const handleDayDetail = (order: any) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const dayOrders = orders.filter((o) =>
      new Date(o.createdAt).toLocaleDateString() === orderDate,
    );
    setDetailDayOrders(dayOrders);
    setDetailDayOpen(true);
  };

  const displayOrders = tab === 0
    ? orders.filter((o) => {
        const q = todaySearch.toLowerCase();
        return (!todaySearch || (o.customer?.name || "").toLowerCase().includes(q)) &&
               (!todayInvNum || (o.invoiceNumber && String(o.invoiceNumber).includes(todayInvNum)));
      })
    : orders;
  const paginated = displayOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(displayOrders.length / PER_PAGE);

  const billingValue = { todayClosed, todayLocal, isTodayOrder, confirmPayment, openEdit, revertBill, cancelBill, openCreditNote };

  if (loading && orders.length === 0)
    return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <BillingProvider value={billingValue}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("billing.title")}</h1>
          <Button onClick={() => setNewBillOpen(true)} className="gap-2"><ImPlus /> {t("billing.newBill")}</Button>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
          {TABS.map((k, i) => (
            <button key={k} onClick={() => setTab(i)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors capitalize ${tab === i ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {k === "today" ? t("billing.today") : t("billing.history")}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <TodayView orders={orders} loading={loading} page={page} setPage={setPage}
            totalPages={totalPages} displayOrders={displayOrders} paginated={paginated}
            unclosedDays={unclosedDays} todayLocal={todayLocal}
            todaySearch={todaySearch} setTodaySearch={setTodaySearch}
            todayInvNum={todayInvNum} setTodayInvNum={setTodayInvNum}
            bcvRate={bcvRate} />
        )}

        {tab === 1 && (
          <HistoryView orders={orders} loading={loading} page={page} setPage={setPage}
            totalPages={totalPages} paginated={paginated} closedDays={closedDays}
            hDateFrom={hDateFrom} setHDateFrom={setHDateFrom} hDateTo={hDateTo} setHDateTo={setHDateTo}
            hSearch={hSearch} setHSearch={setHSearch} hInvNum={hInvNum} setHInvNum={setHInvNum}
            onSearch={handleHistorySearch} onReset={handleHistoryReset} onDetail={handleDetail} onDayDetail={handleDayDetail}
            bcvRate={bcvRate} />
        )}

        <InvoiceDetailDialog open={detailOpen} onOpenChange={setDetailOpen} order={detailOrder}
          onRefresh={() => { tab === 0 ? fetchOrders("?unclosedOnly=true") : handleHistorySearch(); }} />
        <DayOrdersDialog open={detailDayOpen} onOpenChange={setDetailDayOpen} orders={detailDayOrders} />
        <NewBillDialog open={newBillOpen} onOpenChange={setNewBillOpen}
          onBillCreated={() => { fetchOrders(tab === 0 ? "?unclosedOnly=true" : ""); }} />
        <EditBillDialog open={editOpen} onOpenChange={setEditOpen} bill={editingBill}
          onSaved={() => { tab === 0 ? fetchOrders("?unclosedOnly=true") : handleHistorySearch(); }} />
        <CreditNoteDialog open={cnOpen} onOpenChange={setCnOpen} order={cnOrder}
          onIssued={() => { tab === 0 ? fetchOrders("?unclosedOnly=true") : handleHistorySearch(); }} />
      </div>
    </BillingProvider>
  );
}
