import { connectDB } from "@/database/connection";
import { Product } from "@/database/models/product";
import { Category } from "@/database/models/category";
import { Config } from "@/database/models/config";
import { slugify } from "@/utils/slugify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug, available: true }).lean();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const [config, category] = await Promise.all([
      Config.findOne().lean(),
      product.categoryId
        ? Category.findById(product.categoryId).lean()
        : null,
    ]);

    const exchangeRateBcv = config?.exchangeRateBcv ?? 0;
    const priceBs =
      exchangeRateBcv > 0
        ? Math.round((product as any).price * exchangeRateBcv * 100) / 100
        : 0;

    const response = {
      _id: (product as any)._id.toString(),
      name: (product as any).name,
      slug: (product as any).slug ?? "",
      price: (product as any).price,
      priceBs,
      images: (product as any).images ?? [],
      description: (product as any).description ?? "",
      ingredients: (product as any).ingredients ?? [],
      categoryId: (product as any).categoryId?.toString() ?? "",
      categoryName: (category as any)?.name ?? "",
      categorySlug: category ? slugify((category as any).name) : "",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/frontend/menu/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
