import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, Users } from "lucide-react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

const stats = [
  { label: "Products", icon: Package, value: "10", href: "/dashboard/products" },
  { label: "Bookings", icon: CalendarDays, value: "—", href: "/dashboard/bookings" },
  { label: "Users", icon: Users, value: "—", href: "/dashboard/users" },
];

export default async function DashboardHome() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome{session.user?.name ? `, ${session.user.name}` : ""}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <a key={s.label} href={s.href} className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
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
