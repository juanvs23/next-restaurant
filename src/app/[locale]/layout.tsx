import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  Components,
  CartHydrator,
  CartSheet,
  CartPersister,
  AosInitializer,
} from "@/components/frontend";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "GERÍCHT - RESTAURANT" : "GERÍCHT - RESTAURANT",
    description:
      locale === "es"
        ? "El mejor restaurante de Chicago"
        : "The best restaurant in Chicago",
  };
}

export default async function FrontendLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-black2 min-h-screen text-white2">
        <AosInitializer />
        <CartHydrator />
        <CartPersister />
        <Components.Header />
        {children}
        <Components.Footer />
        <CartSheet />
      </div>
    </NextIntlClientProvider>
  );
}
