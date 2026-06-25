"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, Users } from "lucide-react";
import { useT } from "@/i18n/useT";

export default function DashboardHome() {
  const { t } = useT();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => {
        if (s?.user?.name) setUserName(s.user.name);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { labelKey: "nav.products", icon: Package, value: "—", href: "/dashboard/products" },
    { labelKey: "nav.bookings", icon: CalendarDays, value: "—", href: "/dashboard/bookings" },
    { labelKey: "nav.users", icon: Users, value: "—", href: "/dashboard/users" },
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(s.labelKey)}
                  </CardTitle>
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
    </div>
  );
}
