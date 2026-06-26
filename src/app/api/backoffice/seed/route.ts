import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { Product } from "@/database/models/product";
import { requireRole } from "@/libs/auth/require-role";
import { NextResponse } from "next/server";
import { menu } from "@/libs/data/menu";

export async function POST() {
  const error = await requireRole("admin");
  if (error) return error;
  await connectDB();

  // 1. Create categories
  const [wineBeer, cocktails] = await Promise.all([
    Category.findOneAndUpdate(
      { name: "Wine & Beer" },
      { name: "Wine & Beer", description: "Wines and beers selection" },
      { upsert: true, new: true }
    ),
    Category.findOneAndUpdate(
      { name: "Cocktails" },
      { name: "Cocktails", description: "Signature cocktails" },
      { upsert: true, new: true }
    ),
  ]);

  const categoryMap: Record<string, string> = {
    "Wine & Beer": wineBeer._id.toString(),
    Cocktails: cocktails._id.toString(),
  };

  // 2. Insert products
  let inserted = 0;
  for (const item of menu) {
    const catId = categoryMap[item.categories[0]];
    if (!catId) continue;

    await Product.findOneAndUpdate(
      { SKU: item.SKU },
      {
        name: item.title,
        description: item.description,
        price: item.specs.sizes[0]?.price ?? 0,
        categoryId: catId,
        type: item.type,
        ingredients: item.specs.ingredients,
        sizes: item.specs.sizes.map((s) => ({
          name: s.name,
          price: s.price,
          tax: s.tax,
        })),
        SKU: item.SKU,
        available: true,
      },
      { upsert: true, new: true }
    );
    inserted++;
  }

  // 3. Link products to categories
  for (const [catName, catId] of Object.entries(categoryMap)) {
    const productIds = await Product.find({ categoryId: catId }).distinct("_id");
    await Category.findByIdAndUpdate(catId, { items: productIds });
  }

  return NextResponse.json({
    success: true,
    categories: Object.keys(categoryMap).length,
    products: inserted,
  });
}
