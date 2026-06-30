"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className="flex items-center justify-center px-2 py-1 text-xs font-semibold rounded border border-golden/30 text-golden hover:bg-golden/10 transition-colors uppercase"
      aria-label={`Cambiar a ${switchTo === "es" ? "Español" : "English"}`}
    >
      {switchTo.toUpperCase()}
    </button>
  );
}
