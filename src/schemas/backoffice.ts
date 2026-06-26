import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  role: z.enum(["admin", "staff", "user"]).optional(),
  provider: z.enum(["credentials"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum(["admin", "staff", "user"]).optional(),
  active: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  type: z.enum(["food", "drink", "dessert"]).optional(),
  images: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  SKU: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  taxIds: z.array(z.string()).optional(),
  available: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  type: z.enum(["food", "drink", "dessert"]).optional(),
  images: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  SKU: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  taxIds: z.array(z.string()).optional(),
  available: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  comandaId: z.string().optional(),
  pedidoIds: z.array(z.string()).optional(),
  tableLabel: z.string().optional(),
  isDelivery: z.boolean().optional(),
  items: z.array(orderItemSchema).min(1),
  customer: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  orderCharges: z.array(z.object({
    name: z.string(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number(),
    amount: z.number(),
  })).optional(),
  deliveryCost: z.number().nonnegative().optional(),
});
