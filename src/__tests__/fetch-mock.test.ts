describe("fetch mock", () => {
  it("intercepts /api/auth/session", async () => {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    expect(data.user.name).toBe("Test Admin");
    expect(data.role).toBe("admin");
  });

  it("intercepts /api/backoffice/products", async () => {
    const res = await fetch("/api/backoffice/products");
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].name).toBe("P1");
  });

  it("intercepts /api/frontend/config", async () => {
    const res = await fetch("/api/frontend/config");
    const data = await res.json();
    expect(data.timezone).toBe("-04:00");
  });

  it("returns empty array for unknown endpoints", async () => {
    const res = await fetch("/api/backoffice/unknown");
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});
