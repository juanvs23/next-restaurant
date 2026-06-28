/**
 * Shared seed data and mock helpers for route handler integration tests.
 *
 * Uses plain string IDs to avoid importing Mongoose (which triggers ESM parsing).
 *
 * Usage:
 *   import { mockCategories, mockProducts, mockConfig } from "@/__tests__/helpers/mock-db";
 *   Then set up jest.mock() at the top level of your test file.
 */

// ── Test IDs as plain strings (not ObjectIds, to avoid mongoose import) ──
export const CAT_ID_1 = "000000000000000000000001";
export const CAT_ID_2 = "000000000000000000000002";
export const CAT_ID_3 = "000000000000000000000003";

export const PROD_ID_1 = "000000000000000000000011";
export const PROD_ID_2 = "000000000000000000000012";
export const PROD_ID_3 = "000000000000000000000013";
export const PROD_ID_4 = "000000000000000000000014";

// ── Seed data (all _id as strings, categoryId as strings) ──
export const mockCategories = [
  { _id: CAT_ID_1, name: "Bebidas", description: "Refrescantes", image: "" },
  {
    _id: CAT_ID_2,
    name: "Platos Fuertes",
    description: "Deliciosos",
    image: "",
  },
  { _id: CAT_ID_3, name: "Extras", description: "Adicionales", image: "" },
];

export const mockFeaturedProducts = [
  {
    _id: PROD_ID_1,
    name: "Agua Mineral",
    slug: "agua-mineral",
    price: 2,
    categoryId: CAT_ID_1,
    images: ["agua.jpg"],
    featured: true,
    description: "Agua purificada",
    ingredients: ["agua"],
    available: true,
  },
  {
    _id: PROD_ID_2,
    name: "Jugo de Naranja",
    slug: "jugo-de-naranja",
    price: 5,
    categoryId: CAT_ID_1,
    images: ["jugo.jpg"],
    featured: true,
    description: "Jugo natural",
    ingredients: ["naranja"],
    available: true,
  },
  {
    _id: PROD_ID_3,
    name: "Parrilla para 2",
    slug: "parrilla-para-2",
    price: 30,
    categoryId: CAT_ID_2,
    images: ["parrilla.jpg"],
    featured: true,
    description: "Parrilla completa",
    ingredients: ["carne", "chorizo"],
    available: true,
  },
];

export const mockNonFeaturedProducts = [
  {
    _id: PROD_ID_4,
    name: "Pan artesanal",
    slug: "pan-artesanal",
    price: 1,
    categoryId: CAT_ID_2,
    images: [],
    featured: false,
    description: "Pan artesanal",
    ingredients: ["harina"],
    available: true,
  },
];

export const mockAllProducts = [
  ...mockFeaturedProducts,
  ...mockNonFeaturedProducts,
];

export const mockConfig = {
  _id: "0000000000000000000000ff",
  exchangeRateBcv: 36.5,
  exchangeRateUsdt: 40,
  timezone: "-04:00",
  businessName: "GERÍCHT",
  defaultLanguage: "es",
};
