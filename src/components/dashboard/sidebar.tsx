"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  CalendarDays,
  Users,
  ClipboardList,
  ImageIcon,
  Table2,
  Clock,
  UtensilsCrossed,
  BarChart3,
  FileText,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { signOut, useSession } from "next-auth/react";
import { useT } from "@/i18n/useT";

const adminOnly = new Set([
  "/dashboard/users",
  "/dashboard/tables",
  "/dashboard/turns",
  "/dashboard/config",
]);

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { labelKey: "nav.dashboard", path: "/dashboard", icon: LayoutDashboard },
  { labelKey: "nav.products", path: "/dashboard/products", icon: Package },
  { labelKey: "nav.categories", path: "/dashboard/categories", icon: Tags },
  { labelKey: "nav.bookings", path: "/dashboard/bookings", icon: CalendarDays },
  { labelKey: "nav.users", path: "/dashboard/users", icon: Users },
  { labelKey: "nav.tables", path: "/dashboard/tables", icon: Table2 },
  { labelKey: "nav.turns", path: "/dashboard/turns", icon: Clock },
  { labelKey: "nav.comanda", path: "/dashboard/comanda", icon: UtensilsCrossed },
  { labelKey: "nav.billing", path: "/dashboard/orders", icon: ClipboardList },
  { labelKey: "nav.reports", path: "/dashboard/reports", icon: BarChart3 },
  { labelKey: "nav.creditNotes", path: "/dashboard/credit-notes", icon: FileText },
  { labelKey: "nav.media", path: "/dashboard/media", icon: ImageIcon },
  { labelKey: "nav.settings", path: "/dashboard/config", icon: Settings },
];

export function Sidebar() {
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const { data: session } = useSession();
  const role = session?.role;

  const visibleItems = navItems.filter(
    (item) => role === "admin" || !adminOnly.has(item.path),
  );

  return (
    <aside className="w-64 border-r bg-card p-4 flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="text-2xl font-bold text-primary no-underline px-3"
      >
        GERÍCHT
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {visibleItems.map((item) => {
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
                {t(item.labelKey)}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={toggle}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {theme === "dark" ? t("nav.lightMode", "Light") : t("nav.darkMode", "Dark")} Mode
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-destructive justify-start"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4" />
        {t("nav.logout")}
      </Button>
    </aside>
  );
}
