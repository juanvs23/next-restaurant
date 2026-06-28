import { GET as getMenu } from "@/app/api/frontend/menu/route";
import { GET as getBreakdown } from "@/app/api/frontend/menu/breakdown/route";
import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { Product } from "@/database/models/product";
import { Config } from "@/database/models/config";
import {
  mockCategories,
  mockFeaturedProducts,
  mockAllProducts,
  mockConfig,
  CAT_ID_2,
} from "@/__tests__/helpers/mock-db";

// ── Module mocks ──
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: any) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));
jest.mock("@/database/connection", () => ({
  connectDB: jest.fn(),
}));

jest.mock("@/database/models/category", () => ({
  Category: { find: jest.fn() },
}));

jest.mock("@/database/models/product", () => ({
  Product: { find: jest.fn() },
}));

jest.mock("@/database/models/config", () => ({
  Config: { findOne: jest.fn() },
}));

function mockQueryChain(resolvedValue: any) {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(resolvedValue),
  };
  return chain;
}

function createMenuRequest(): any {
  return { url: "http://localhost/api/frontend/menu" };
}

function createBreakdownRequest(url: string): any {
  return { url };
}

describe("GET /api/frontend/menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Category.find as jest.Mock).mockReturnValue(
      mockQueryChain(mockCategories)
    );
    (Product.find as jest.Mock).mockReturnValue(
      mockQueryChain(mockFeaturedProducts)
    );
    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain(mockConfig)
    );
  });

  it("returns categories with featured products", async () => {
    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.categories).toBeDefined();
    expect(body.categories.length).toBeGreaterThan(0);
    expect(connectDB).toHaveBeenCalled();
  });

  it("includes priceBs calculated from exchange rate", async () => {
    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    // Bebidas category has 2 products: Agua Mineral ($2) and Jugo de Naranja ($5)
    const bebidas = body.categories.find(
      (c: any) => c.name === "Bebidas"
    );
    expect(bebidas).toBeDefined();

    // $2 * 36.5 = 73
    const agua = bebidas.products.find((p: any) => p.name === "Agua Mineral");
    expect(agua.priceBs).toBe(73);

    // $5 * 36.5 = 182.5
    const jugo = bebidas.products.find((p: any) => p.name === "Jugo de Naranja");
    expect(jugo.priceBs).toBe(182.5);
  });

  it("sorts products by name ascending", async () => {
    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    const bebidas = body.categories.find(
      (c: any) => c.name === "Bebidas"
    );
    const names = bebidas.products.map((p: any) => p.name);
    expect(names).toEqual(["Agua Mineral", "Jugo de Naranja"]);
  });

  it("excludes categories with no featured products", async () => {
    // Only return products in CAT_ID_1 (Bebidas), leaving CAT_ID_2 and CAT_ID_3 empty
    const bebidasOnly = mockFeaturedProducts.filter(
      (p: any) => p.categoryId?.toString() === mockCategories[0]._id.toString()
    );

    (Product.find as jest.Mock).mockReturnValue(
      mockQueryChain(bebidasOnly)
    );

    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    expect(body.categories.length).toBe(1);
    expect(body.categories[0].name).toBe("Bebidas");
  });

  it("handles zero exchange rate gracefully", async () => {
    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain({ ...mockConfig, exchangeRateBcv: 0 })
    );

    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    for (const cat of body.categories) {
      for (const prod of cat.products) {
        expect(prod.priceBs).toBe(0);
      }
    }
  });

  it("returns 500 on database error", async () => {
    (Product.find as jest.Mock).mockImplementation(() => {
      throw new Error("DB connection lost");
    });

    const response = await getMenu(createMenuRequest());
    expect(response.status).toBe(500);
  });

  it("returns featured and images fields", async () => {
    const response = await getMenu(createMenuRequest());
    const body = await response.json();

    const product = body.categories[0].products[0];
    expect(product).toHaveProperty("featured");
    expect(product).toHaveProperty("images");
    expect(Array.isArray(product.images)).toBe(true);
  });
});

describe("GET /api/frontend/menu/breakdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Category.find as jest.Mock).mockReturnValue(
      mockQueryChain(mockCategories)
    );
    (Product.find as jest.Mock).mockReturnValue(
      mockQueryChain(mockAllProducts)
    );
    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain(mockConfig)
    );
  });

  it("returns all products grouped by category", async () => {
    const response = await getBreakdown(
      createBreakdownRequest("http://localhost/api/frontend/menu/breakdown")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.categories).toBeDefined();
    expect(body.categories.length).toBe(2); // Bebidas (2 featured) + Platos Fuertes (2 products)
  });

  it("returns category slug in response", async () => {
    const response = await getBreakdown(
      createBreakdownRequest("http://localhost/api/frontend/menu/breakdown")
    );
    const body = await response.json();

    const cat = body.categories[0];
    expect(cat).toHaveProperty("slug");
    expect(typeof cat.slug).toBe("string");
  });

  it("includes ingredients on each product", async () => {
    const response = await getBreakdown(
      createBreakdownRequest("http://localhost/api/frontend/menu/breakdown")
    );
    const body = await response.json();

    const product = body.categories[0].products[0];
    expect(product).toHaveProperty("ingredients");
    expect(Array.isArray(product.ingredients)).toBe(true);
  });

  it("filters by search query", async () => {
    const response = await getBreakdown(
      createBreakdownRequest(
        "http://localhost/api/frontend/menu/breakdown?search=agua"
      )
    );
    const body = await response.json();

    // Product.find should have been called with a regex filter
    const findCall = (Product.find as jest.Mock).mock.calls[0][0];
    expect(findCall.name).toBeDefined();
    expect(findCall.name.$regex).toBeDefined();

    // Manually test: with our mock we always return all products,
    // but we verify the filter was constructed correctly
    expect(findCall.name.$options).toBe("i");
  });

  it("filters by category", async () => {
    const catId = CAT_ID_2.toString();
    const response = await getBreakdown(
      createBreakdownRequest(
        `http://localhost/api/frontend/menu/breakdown?category=${catId}`
      )
    );

    // Verify the filter was passed correctly
    const findCall = (Product.find as jest.Mock).mock.calls[0][0];
    expect(findCall.categoryId).toBe(catId);
  });

  it("uses escapeRegex for search to prevent regex injection", async () => {
    await getBreakdown(
      createBreakdownRequest(
        "http://localhost/api/frontend/menu/breakdown?search=.*"
      )
    );

    const findCall = (Product.find as jest.Mock).mock.calls[0][0];
    // The escaped regex should NOT match everything — the dot and star should be escaped
    expect(findCall.name.$regex).not.toBe(".*");
  });

  it("returns 500 on database error", async () => {
    (Product.find as jest.Mock).mockImplementation(() => {
      throw new Error("DB connection lost");
    });

    const response = await getBreakdown(
      createBreakdownRequest("http://localhost/api/frontend/menu/breakdown")
    );
    expect(response.status).toBe(500);
  });
});
