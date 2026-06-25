import type { Metadata } from "next";
import "./dashboard.css";
import { DashboardProviders } from "@/components/dashboard/dashboard-providers";
import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Backoffice — GERÍCHT",
  description: "Admin panel",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProviders>
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </DashboardProviders>
  );
}
