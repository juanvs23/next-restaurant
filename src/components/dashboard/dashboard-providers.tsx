"use client";
import { useEffect, useState } from "react";
import { I18nProvider } from "@/i18n/useT";
import { ThemeProvider } from "@/components/dashboard/theme-provider";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    fetch("/api/backoffice/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.defaultLanguage) setLocale(cfg.defaultLanguage);
      })
      .catch(() => {}); // fallback to "es"
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>
        <div className="min-h-screen flex bg-background text-foreground transition-colors">
          {children}
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
