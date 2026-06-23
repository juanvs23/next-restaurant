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
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Categories", path: "/dashboard/categories", icon: Tags },
  { label: "Bookings", path: "/dashboard/bookings", icon: CalendarDays },
  { label: "Users", path: "/dashboard/users", icon: Users },
  { label: "Tables", path: "/dashboard/tables", icon: Table2 },
  { label: "Turns", path: "/dashboard/turns", icon: Clock },
  { label: "Comanda", path: "/dashboard/comanda", icon: UtensilsCrossed },
  { label: "Billing", path: "/dashboard/orders", icon: ClipboardList },
  { label: "Media", path: "/dashboard/media", icon: ImageIcon },
  { label: "Settings", path: "/dashboard/config", icon: Settings },
];

export function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-64 border-r bg-card p-4 flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="text-2xl font-bold text-primary no-underline px-3"
      >
        GERÍCHT
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
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

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={toggle}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {theme === "dark" ? "Light" : "Dark"} Mode
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-destructive justify-start"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </aside>
  );
}
