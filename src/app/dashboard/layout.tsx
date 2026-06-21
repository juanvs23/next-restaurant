import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  CalendarDays,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Backoffice — GERÍCHT",
  description: "Admin panel",
};

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Categories", path: "/dashboard/categories", icon: Tags },
  { label: "Bookings", path: "/dashboard/bookings", icon: CalendarDays },
  { label: "Users", path: "/dashboard/users", icon: Users },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-primary no-underline px-3"
        >
          GERÍCHT
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className="justify-start gap-3 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href={item.path}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
