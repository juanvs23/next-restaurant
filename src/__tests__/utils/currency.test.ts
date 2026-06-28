import { usdToVes, formatVes, formatUsd, fmtPrice, fmtPriceFull } from "@/libs/currency";

describe("usdToVes", () => {
  it("multiplies USD by rate and rounds to 2 decimals", () => {
    expect(usdToVes(10, 36.5)).toBe(365);
    expect(usdToVes(5.5, 36.5)).toBe(200.75);
    expect(usdToVes(1.33, 36.5)).toBe(48.55);
  });

  it("returns 0 when USD is 0", () => {
    expect(usdToVes(0, 36.5)).toBe(0);
  });

  it("handles rate = 0 gracefully", () => {
    expect(usdToVes(100, 0)).toBe(0);
  });
});

describe("formatVes", () => {
  it("formats with Bs prefix and locale es-VE", () => {
    const result = formatVes(1234.5);
    expect(result).toContain("Bs");
    expect(result).toContain("1");
  });
});

describe("formatUsd", () => {
  it("formats with $ prefix and 2 decimals", () => {
    expect(formatUsd(10)).toBe("$10.00");
    expect(formatUsd(10.5)).toBe("$10.50");
    expect(formatUsd(10.99)).toBe("$10.99");
  });
});

describe("fmtPrice", () => {
  it("returns formatted VES with USD equivalent", () => {
    const result = fmtPrice(365, 36.5);
    expect(result).toContain("Bs");
    expect(result).toContain("$10.00");
  });

  it("returns only VES when rate is 0", () => {
    const result = fmtPrice(100, 0);
    expect(result).toContain("Bs");
    expect(result).not.toContain("≈");
  });
});

describe("fmtPriceFull", () => {
  it("returns VES with BCV and USDT rates", () => {
    const result = fmtPriceFull(365, 36.5, 40);
    expect(result).toContain("Bs");
    expect(result).toContain("USD-BCV");
    expect(result).toContain("USDT");
  });

  it("omits rates when they are 0", () => {
    const result = fmtPriceFull(100, 0, 0);
    expect(result).toContain("Bs");
    expect(result).not.toContain("≈");
  });
});
