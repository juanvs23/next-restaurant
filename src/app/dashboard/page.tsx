"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useT } from "@/i18n/useT";
import { formatVes, formatUsd } from "@/libs/currency";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthStartStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

async function fetchSum(url: string): Promise<number | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const data: any[] = await r.json();
    if (!Array.isArray(data)) return null;
    return data.reduce((sum, o) => sum + (o.total || 0), 0);
  } catch {
    return null;
  }
}

export default function DashboardHome() {
  const { t } = useT();
  const [userName, setUserName] = useState("");
  const [productCount, setProductCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [todayTotal, setTodayTotal] = useState<number | null>(null);
  const [yesterdayTotal, setYesterdayTotal] = useState<number | null>(null);
  const [monthTotal, setMonthTotal] = useState<number | null>(null);
  const [bcvRate, setBcvRate] = useState(0);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => { if (s?.user?.name) setUserName(s.user.name); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const today = todayStr();
    const yesterday = yesterdayStr();
    const monthStart = monthStartStr();

    Promise.all([
      fetch("/api/backoffice/products").then((r) => r.ok ? r.json() : null).then((d) => setProductCount(Array.isArray(d) ? d.length : null)),
      fetch("/api/backoffice/bookings").then((r) => r.ok ? r.json() : null).then((d) => setBookingCount(Array.isArray(d) ? d.length : null)),
      fetch("/api/backoffice/users").then((r) => r.ok ? r.json() : null).then((d) => setUserCount(Array.isArray(d) ? d.length : null)),
      fetchSum(`/api/backoffice/orders?dateFrom=${today}&dateTo=${today}&status=paid`).then(setTodayTotal),
      fetchSum(`/api/backoffice/orders?dateFrom=${yesterday}&dateTo=${yesterday}&status=paid`).then(setYesterdayTotal),
      fetchSum(`/api/backoffice/orders?dateFrom=${monthStart}&dateTo=${today}&status=paid`).then(setMonthTotal),
      fetch("/api/frontend/config").then(r => r.json()).then(cfg => setBcvRate(cfg.exchangeRateBcv ?? 0)).catch(() => {}),
    ]);
  }, []);

  const stats = [
    { labelKey: "nav.products", icon: Package, value: productCount !== null ? String(productCount) : "—", href: "/dashboard/products" },
    { labelKey: "nav.bookings", icon: CalendarDays, value: bookingCount !== null ? String(bookingCount) : "—", href: "/dashboard/bookings" },
    { labelKey: "nav.users", icon: Users, value: userCount !== null ? String(userCount) : "—", href: "/dashboard/users" },
  ];

  const finances = [
    { label: "dashboard.todayBalance", icon: DollarSign, value: todayTotal },
    { label: "dashboard.yesterdayBalance", icon: Clock, value: yesterdayTotal },
    { label: "dashboard.monthBalance", icon: TrendingUp, value: monthTotal },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("dashboard.welcome")}{userName ? `, ${userName}` : ""}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <a key={s.labelKey} href={s.href} className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t(s.labelKey)}</CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{s.value}</p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold tracking-tight">{t("dashboard.financialSummary")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {finances.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t(f.label)}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{f.value !== null ? formatVes(f.value) : "—"}</p>
                {f.value !== null && f.value > 0 && bcvRate > 0 && (
                  <p className="text-xs text-muted-foreground">{formatUsd(f.value / bcvRate)}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
