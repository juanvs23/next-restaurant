import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { Product } from "@/database/models/product";
import { Config } from "@/database/models/config";
import { escapeRegex } from "@/utils/escapeRegex";
import { slugify } from "@/utils/slugify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    // Build product filter
    const filter: any = { available: true };

    if (search) {
      const escaped = escapeRegex(search);
      filter.name = { $regex: escaped, $options: "i" };
    }

    if (category) {
      filter.categoryId = category;
    }

    const [products, categories, config] = await Promise.all([
      Product.find(filter).sort({ name: 1 }).lean(),
      Category.find().lean(),
      Config.findOne().lean(),
    ]);

    const exchangeRateBcv = config?.exchangeRateBcv ?? 0;

    // Build category lookup
    const categoryMap = new Map(
      categories.map((cat: any) => [cat._id.toString(), cat])
    );

    // Group products by categoryId
    const grouped = new Map<string, any[]>();
    for (const product of products as any[]) {
      const catId = product.categoryId?.toString();
      if (!catId) continue;

      if (!grouped.has(catId)) {
        grouped.set(catId, []);
      }
      grouped.get(catId)!.push(product);
    }

    // Build response
    const resultCategories: any[] = [];
    for (const [catId, catProducts] of grouped) {
      const cat = categoryMap.get(catId);
      if (!cat) continue;

      resultCategories.push({
        _id: cat._id.toString(),
        name: cat.name,
        slug: slugify(cat.name),
        products: (catProducts as any[]).map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          slug: p.slug ?? "",
          price: p.price,
          priceBs:
            exchangeRateBcv > 0
              ? Math.round(p.price * exchangeRateBcv * 100) / 100
              : 0,
          images: p.images ?? [],
          description: p.description ?? "",
          ingredients: p.ingredients ?? [],
          categoryId: p.categoryId?.toString() ?? "",
        })),
      });
    }

    return NextResponse.json({ categories: resultCategories });
  } catch (error) {
    console.error("GET /api/frontend/menu/breakdown error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
