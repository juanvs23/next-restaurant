import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Backoffice — GERÍCHT",
  description: "Admin panel",
};

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/dashboard/products" },
  { label: "Categories", path: "/dashboard/categories" },
  { label: "Bookings", path: "/dashboard/bookings" },
  { label: "Users", path: "/dashboard/users" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-black2">
      <aside className="w-64 bg-black border-r border-golden/20 p-6 flex flex-col gap-6">
        <Link href="/dashboard" className="text-golden text-2xl font-bold no-underline">
          GERÍCHT
        </Link>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-white2 hover:text-golden transition-colors duration-300 no-underline py-2 px-3 rounded hover:bg-golden/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
