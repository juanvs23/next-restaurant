import CenterImage from "@/public/menu/cocktell.webp";
import { SlideMenuSection } from "@/types/sections";
import { Product } from "@/types/menu";

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  priceBs: number;
  images: string[];
  description?: string;
  type?: string;
  SKU?: string;
  ingredients?: string[];
}

interface ApiCategory {
  _id: string;
  name: string;
  products: ApiProduct[];
}

interface ApiResponse {
  categories: ApiCategory[];
}

function mapProduct(apiProduct: ApiProduct, categoryName: string): Product {
  return {
    type: apiProduct.type || "food",
    title: apiProduct.name,
    categories: [categoryName],
    images: apiProduct.images?.length
      ? apiProduct.images.map((url) => ({
          src: url,
          width: 200,
          height: 200,
          title: apiProduct.name,
        }))
      : [],
    specs: {
      ingredients: apiProduct.ingredients || [],
      unit: [],
      sizes: [
        {
          id: apiProduct._id,
          name: "regular",
          price: apiProduct.price,
          tax: 0,
        },
      ],
    },
    description: apiProduct.description || "",
    SKU: apiProduct.SKU || "",
  };
}

export async function getSlidesContents(): Promise<SlideMenuSection[]> {
  try {
    const res = await fetch("/api/frontend/menu");
    if (!res.ok) return [];
    const data: ApiResponse = await res.json();
    const categories = data.categories ?? [];

    if (categories.length === 0) return [];

    // Pair categories into slides: [A,B], [C,D], [E,F], ...
    const slides: SlideMenuSection[] = [];
    for (let i = 0; i < categories.length; i += 2) {
      const catA = categories[i];
      const catB = categories[i + 1];

      slides.push({
        title: catB ? `${catA.name} & ${catB.name}` : catA.name,
        subTitle: "Menú Destacado",
        sectionA: {
          title: catA.name,
          products: catA.products.map((p) => mapProduct(p, catA.name)),
        },
        sectionB: catB
          ? {
              title: catB.name,
              products: catB.products.map((p) => mapProduct(p, catB.name)),
            }
          : { title: "", products: [] },
        centerImage: {
          src: CenterImage.src,
          width: CenterImage.width,
          height: CenterImage.height,
          title: "GERÍCHT",
        },
      });
    }

    return slides;
  } catch {
    return [];
  }
}
