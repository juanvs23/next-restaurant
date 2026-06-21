import type { Metadata } from "next";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
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
    <ThemeProvider>
      <div className="min-h-screen flex bg-background text-foreground transition-colors">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </ThemeProvider>
  );
}
