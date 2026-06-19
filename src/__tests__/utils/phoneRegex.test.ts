import { phoneRegex } from "@/utils/phoneRegex";

describe("phoneRegex", () => {
  it("matches valid phone numbers", () => {
    expect(phoneRegex.test("+1 (555) 123-4567")).toBe(true);
    expect(phoneRegex.test("555-123-4567")).toBe(true);
    expect(phoneRegex.test("+5491123456789")).toBe(true);
    expect(phoneRegex.test("1234567890")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(phoneRegex.test("")).toBe(false);
    expect(phoneRegex.test("abc")).toBe(false);
    expect(phoneRegex.test("!@#$%")).toBe(false);
  });
});
