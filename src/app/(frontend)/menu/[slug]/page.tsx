import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ImageCarousel } from "@/components/frontend";
import { formatVes } from "@/libs/currency";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { AddToCartButton } from "./AddToCartButton";

// ── Types ──

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceBs: number;
  images: string[];
  description: string;
  ingredients: string[];
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
}

// ── Metadata ──

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/frontend/menu/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();

  const product: ProductDetail = await res.json();
  return {
    title: `${product.name} — GERÍCHT`,
    description: product.description || `${product.name} en GERÍCHT Restaurant`,
  };
}

// ── Page ──

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/frontend/menu/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();

  const product: ProductDetail = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-white2/50">
        <Link href="/" className="hover:text-golden transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/menu" className="hover:text-golden transition-colors">
          Menú
        </Link>
        {product.categoryName && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            {product.categorySlug ? (
              <Link
                href={`/menu?category=${product.categoryId}`}
                className="hover:text-golden transition-colors"
              >
                {product.categoryName}
              </Link>
            ) : (
              <span>{product.categoryName}</span>
            )}
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white2">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image carousel */}
        <ImageCarousel
          images={product.images}
          productName={product.name}
        />

        {/* Product info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-serif text-4xl font-bold text-golden">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-white2">
              {formatVes(product.priceBs)}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 font-serif text-lg font-semibold text-golden/80">
                Descripción
              </h2>
              <p className="text-white2/70 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h2 className="mb-2 font-serif text-lg font-semibold text-golden/80">
                Ingredientes
              </h2>
              <ul className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-white2/10 bg-white2/5 px-3 py-1 text-sm text-white2/60"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AddToCartButton
            product={{
              _id: product._id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              priceBs: product.priceBs,
              image: product.images?.[0] ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
