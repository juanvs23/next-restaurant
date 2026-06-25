"use client";
import { createContext, useContext, useCallback, useEffect, useState } from "react";

type Translations = Record<string, any>;

const CACHE: Record<string, Translations> = {};

async function loadLocale(locale: string): Promise<Translations> {
  if (CACHE[locale]) return CACHE[locale];
  try {
    const data = await import(`@/i18n/${locale}.json`);
    CACHE[locale] = data.default || data;
    return CACHE[locale];
  } catch {
    const fallback = await import(`@/i18n/en.json`);
    return fallback.default || fallback;
  }
}

interface I18nContextType {
  locale: string;
  t: (path: string, fallback?: string) => string;
  setLocale: (l: string) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  t: (p: string) => p,
  setLocale: () => {},
});

export function I18nProvider({ children, initialLocale = "es" }: { children: React.ReactNode; initialLocale?: string }) {
  const [locale, setLocale] = useState(initialLocale);
  const [dict, setDict] = useState<Translations>({});

  useEffect(() => {
    loadLocale(locale).then(setDict);
  }, [locale]);

  const t = useCallback((path: string, fb?: string): string => {
    const keys = path.split(".");
    let val: any = dict;
    for (const key of keys) {
      val = val?.[key];
      if (val === undefined) return fb ?? path;
    }
    return typeof val === "string" ? val : (fb ?? path);
  }, [dict]);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
