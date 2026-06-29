import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import {
  ProductCard,
  ResponsiveGrid,
  MenuFilters,
} from "@/components/frontend";
import { getBaseUrl } from "@/utils/getBaseUrl";

export const metadata: Metadata = {
  title: "Menú — GERÍCHT",
  description: "Explora nuestro menú en el mejor restaurante de Berlín",
};

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

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
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
        <p className="text-lg">Error al cargar el menú. Intenta de nuevo más tarde.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-golden hover:text-golden2 transition-colors"
        >
          Volver al inicio
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
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white2">Menú</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold text-golden">Menú</h1>
        {params.search || params.category ? (
          <Link
            href="/menu"
            className="flex items-center gap-1 text-sm text-white2/60 hover:text-golden transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Limpiar filtros
          </Link>
        ) : null}
      </div>

      {/* Filters — wrapped in Suspense for useSearchParams */}
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
              ? `No encontramos resultados para "${params.search}"`
              : "No hay productos disponibles en esta categoría."}
          </p>
          <Link
            href="/menu"
            className="mt-3 inline-block text-golden hover:text-golden2 transition-colors"
          >
            Ver todo el menú
          </Link>
        </div>
      ) : (
        <ResponsiveGrid>
          {allProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
}
