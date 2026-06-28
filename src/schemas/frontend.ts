import { z } from "zod";
import { phoneRegex } from "@/utils/phoneRegex";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email("Invalid email format").optional(),
    phone: z
      .string()
      .regex(phoneRegex, "Invalid phone number format"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        productName: z.string().min(1, "Product name is required"),
        price: z.number().nonnegative("Price must be non-negative"),
        quantity: z
          .number()
          .int("Quantity must be an integer")
          .min(1, "Minimum quantity is 1")
          .max(99, "Maximum quantity is 99"),
      })
    )
    .min(1, "At least one item is required")
    .max(50, "Maximum 50 items allowed"),
  notes: z.string().optional(),
});

export const reviewOrderSchema = z.object({
  action: z.enum(["accept", "reject"]),
  reason: z.string().optional(),
});
