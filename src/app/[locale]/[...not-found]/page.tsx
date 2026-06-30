import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Pages } from "@/components/frontend";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Home() {
  return <Pages.NotFound />;
}
