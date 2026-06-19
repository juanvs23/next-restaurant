import { subscriptionSchema } from "@/schemas/subscription";

describe("subscriptionSchema", () => {
  test("accepts a valid email", () => {
    const result = subscriptionSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  test("rejects an invalid email", () => {
    const result = subscriptionSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  test("requires email field", () => {
    const result = subscriptionSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
