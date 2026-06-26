import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const categories = await Category.find({
    name: { $in: ["Wine & Beer", "Cocktails"] },
  })
    .populate("items")
    .lean();

  const wineBeer = categories.find((c: any) => c.name === "Wine & Beer");
  const cocktails = categories.find((c: any) => c.name === "Cocktails");

  const mapProducts = (items: any[], catName: string) =>
    (items ?? []).map((p: any) => ({
      type: p.type ?? "drinks",
      title: p.name,
      categories: [catName],
      images: [],
      specs: {
        ingredients: p.ingredients ?? [],
        unit: ["ml"],
        sizes: p.sizes ?? [{ id: "0001", name: "regular", price: p.price, tax: 0 }],
      },
      description: p.description ?? "",
      SKU: p.SKU ?? "",
    }));

  const slides = [
    {
      title: "Today’s Special",
      subTitle: "Menu that fits you palatte",
      sectionA: { title: "Wine & Beer", products: mapProducts(wineBeer?.items, "Wine & Beer") },
      sectionB: { title: "Cocktails", products: mapProducts(cocktails?.items, "Cocktails") },
    },
    {
      title: "Specials Drink",
      subTitle: "Menu that fits you palatte",
      sectionA: { title: "Wine & Beer", products: mapProducts(wineBeer?.items, "Wine & Beer") },
      sectionB: { title: "Cocktails", products: mapProducts(cocktails?.items, "Cocktails") },
    },
  ];

  return NextResponse.json(slides);
}
