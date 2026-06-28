import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { Product } from "@/database/models/product";
import { Config } from "@/database/models/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const [categories, featuredProducts, config] = await Promise.all([
      Category.find().lean(),
      Product.find({ featured: true, available: true }).lean(),
      Config.findOne().lean(),
    ]);

    const exchangeRateBcv = config?.exchangeRateBcv ?? 0;
    const categoryMap = new Map(
      categories.map((cat: any) => [cat._id.toString(), cat])
    );

    // Group featured products by categoryId
    const grouped = new Map<string, any[]>();
    for (const product of featuredProducts as any[]) {
      const catId = product.categoryId?.toString();
      if (!catId) continue;

      if (!grouped.has(catId)) {
        grouped.set(catId, []);
      }
      grouped.get(catId)!.push(product);
    }

    // Build response — exclude categories with no featured products
    const resultCategories: any[] = [];
    for (const [catId, products] of grouped) {
      const cat = categoryMap.get(catId);
      if (!cat) continue;

      const sorted = (products as any[])
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          slug: p.slug ?? "",
          price: p.price,
          priceBs: exchangeRateBcv > 0 ? Math.round(p.price * exchangeRateBcv * 100) / 100 : 0,
          images: p.images ?? [],
          featured: p.featured ?? false,
          description: p.description ?? "",
        }));

      resultCategories.push({
        _id: cat._id.toString(),
        name: cat.name,
        products: sorted,
      });
    }

    return NextResponse.json({ categories: resultCategories });
  } catch (error) {
    console.error("GET /api/frontend/menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
