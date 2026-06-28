import { Pages, ProductCard, ResponsiveGrid } from "@/components/frontend";
import Link from "next/link";

// ── Types ──

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
  products: ProductData[];
}

interface MenuResponse {
  categories: CategoryData[];
}

// ── Page ──

export default async function Home() {
  let featuredCategories: CategoryData[] = [];

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/frontend/menu`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data: MenuResponse = await res.json();
      featuredCategories = data.categories ?? [];
    }
  } catch {
    // Silently fail — the static sections still render
  }

  return (
    <main className="mt-10">
      <Pages.Hero />
      <Pages.AboutUs />

      {/* Featured Menu Section */}
      {featuredCategories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-golden sm:text-4xl">
              Menú Destacado
            </h2>
            <p className="mt-2 text-white2/60">
              Una selección de nuestros platos más populares
            </p>
          </div>

          {featuredCategories.map((category) => (
            <div key={category._id} className="mb-12 last:mb-0">
              <h3 className="mb-6 font-serif text-2xl font-semibold text-golden/80">
                {category.name}
              </h3>
              <ResponsiveGrid>
                {category.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </ResponsiveGrid>
            </div>
          ))}

          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-block rounded-md border border-golden px-8 py-3 text-sm font-semibold text-golden transition-colors hover:bg-golden/10"
            >
              Ver menú completo
            </Link>
          </div>
        </section>
      )}

      <Pages.MenuHome />
      <Pages.OurChef />
      <Pages.HomeGallery />
      <Pages.AwardComponent />
      <Pages.FindUs />
    </main>
  );
}
