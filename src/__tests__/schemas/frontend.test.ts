import { checkoutSchema, reviewOrderSchema } from "@/schemas/frontend";

describe("checkoutSchema", () => {
  const validPayload = {
    customer: {
      name: "Juan Pérez",
      phone: "+584141234567",
    },
    items: [
      {
        productId: "507f1f77bcf86cd799439011",
        productName: "Jugo de Naranja",
        price: 5,
        quantity: 2,
      },
    ],
  };

  it("accepts a valid checkout payload", () => {
    const result = checkoutSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts optional email and notes", () => {
    const payload = {
      ...validPayload,
      customer: { ...validPayload.customer, email: "juan@example.com" },
      notes: "Sin hielo",
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects missing customer name", () => {
    const payload = {
      customer: { phone: "+584141234567" },
      items: validPayload.items,
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const payload = {
      ...validPayload,
      customer: { ...validPayload.customer, email: "not-an-email" },
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects empty items array", () => {
    const payload = { ...validPayload, items: [] };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects quantity > 99", () => {
    const payload = {
      ...validPayload,
      items: [{ ...validPayload.items[0], quantity: 100 }],
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const payload = {
      ...validPayload,
      items: [{ ...validPayload.items[0], price: -1 }],
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone", () => {
    const payload = {
      customer: { name: "Test", phone: "abc" },
      items: validPayload.items,
    };
    const result = checkoutSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe("reviewOrderSchema", () => {
  it("accepts accept action", () => {
    const result = reviewOrderSchema.safeParse({ action: "accept" });
    expect(result.success).toBe(true);
  });

  it("accepts reject action with reason", () => {
    const result = reviewOrderSchema.safeParse({
      action: "reject",
      reason: "Out of stock",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid action", () => {
    const result = reviewOrderSchema.safeParse({ action: "invalid" });
    expect(result.success).toBe(false);
  });
});
