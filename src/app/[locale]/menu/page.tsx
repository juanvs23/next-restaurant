import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  ProductGrid,
  MenuFilters,
} from "@/components/frontend";
import { getBaseUrl } from "@/utils/getBaseUrl";

type Props = {
  searchParams: Promise<{ search?: string; category?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("menu");
  return {
    title: t("title") + " — GERÍCHT",
    description: t("title") + " GERÍCHT Restaurant",
  };
}

// ── Types (matching API response) ──

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceBs: number;
  images: string[];
  description: string;
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  products: ProductData[];
}

interface MenuResponse {
  categories: CategoryData[];
}

// ── Page ──

export default async function MenuPage({ searchParams }: Props) {
  const t = await getTranslations("menu");
  const params = await searchParams;
  const baseUrl = await getBaseUrl();

  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category);
  const queryString = qs.toString();

  const res = await fetch(
    `${baseUrl}/api/frontend/menu/breakdown${queryString ? `?${queryString}` : ""}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white2">
        <p className="text-lg">{t("error")}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-golden hover:text-golden2 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  const data: MenuResponse = await res.json();
  const categories = data.categories ?? [];

  // Flatten products for display
  const allProducts = categories.flatMap((cat) =>
    cat.products.map((p) => ({ ...p, categoryName: cat.name }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-white2/50">
        <Link href="/" className="hover:text-golden transition-colors">
          {t("home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white2">{t("title")}</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold text-golden">{t("title")}</h1>
        {params.search || params.category ? (
          <Link
            href="/menu"
            className="flex items-center gap-1 text-sm text-white2/60 hover:text-golden transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("clearFilters")}
          </Link>
        ) : null}
      </div>

      {/* Filters */}
      <Suspense
        fallback={
          <div className="mb-8 h-10 animate-pulse rounded bg-white2/5" />
        }
      >
        <MenuFilters
          categories={categories.map((c) => ({ _id: c._id, name: c.name }))}
          defaultSearch={params.search}
          defaultCategory={params.category}
        />
      </Suspense>

      {/* Products */}
      {allProducts.length === 0 ? (
        <div className="py-20 text-center text-white2/50">
          <p className="text-lg">
            {params.search
              ? t("noResults", { search: params.search })
              : t("noCategory")}
          </p>
          <Link
            href="/menu"
            className="mt-3 inline-block text-golden hover:text-golden2 transition-colors"
          >
            {t("viewAll")}
          </Link>
        </div>
      ) : (
        <ProductGrid products={allProducts} />
      )}
    </div>
  );
}
