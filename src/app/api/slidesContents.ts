import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import CenterImage from "@/public/menu/cocktell.webp";
import { SlideMenuSection } from "@/types/sections";

const mapProducts = (items: any[], catName: string) =>
  (items ?? []).map((p: any) => ({
    type: p.type ?? "drinks",
    title: p.name,
    categories: [catName],
    images: [],
    specs: {
      ingredients: p.ingredients ?? [],
      unit: ["ml"],
      sizes: p.sizes ?? [
        { id: "0001", name: "regular", price: p.price, tax: 0 },
      ],
    },
    description: p.description ?? "",
    SKU: p.SKU ?? "",
  }));

const slidesConfig = [
  { title: "Today’s Special", subTitle: "Menu that fits you palatte" },
  { title: "Specials Drink", subTitle: "Menu that fits you palatte" },
];

export const getSlidesContents = async (): Promise<SlideMenuSection[]> => {
  await connectDB();

  const categories = await Category.find({
    name: { $in: ["Wine & Beer", "Cocktails"] },
  })
    .populate("items")
    .lean();

  const wineBeer = categories.find((c: any) => c.name === "Wine & Beer");
  const cocktails = categories.find((c: any) => c.name === "Cocktails");

  return slidesConfig.map((cfg) => ({
    title: cfg.title,
    subTitle: cfg.subTitle,
    sectionA: {
      title: "Wine & Beer",
      products: mapProducts(wineBeer?.items, "Wine & Beer"),
    },
    sectionB: {
      title: "Cocktails",
      products: mapProducts(cocktails?.items, "Cocktails"),
    },
    centerImage: {
      src: CenterImage.src,
      width: CenterImage.width,
      height: CenterImage.height,
      title: "Drinks",
    },
  }));
};
