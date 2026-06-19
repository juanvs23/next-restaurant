import { suscriptionSchema } from "@/schemas/suscription";

describe("suscriptionSchema", () => {
  it("validates a correct email", () => {
    const result = suscriptionSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = suscriptionSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = suscriptionSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
