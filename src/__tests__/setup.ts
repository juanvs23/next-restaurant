import "@testing-library/jest-dom";

function mockResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  const responses = new Map<string, any>([
    ["/api/auth/session", { user: { name: "Test Admin" }, role: "admin" }],
    ["/api/frontend/config", { timezone: "-04:00", businessName: "GERÍCHT", defaultLanguage: "es" }],
    ["/api/frontend/availability?date=2026-12-25&persons=2", { available: [{ _id: "t1", tableId: "T01", name: "Mesa 1", capacity: 2, location: "ventana" }], total: 1 }],
    ["/api/backoffice/config", { timezone: "-04:00", defaultLanguage: "es" }],
    ["/api/backoffice/products", [{ _id: "p1", name: "P1", price: 10, categoryId: { _id: "c1", name: "Cat" }, type: "food", images: [], available: true, ingredients: [] }]],
    ["/api/backoffice/bookings", [{ _id: "b1", firstName: "Juan", lastName: "Pérez", dateTime: new Date().toISOString(), numberPersons: 4, status: "confirmed" }]],
    ["/api/backoffice/users", [{ _id: "u1", name: "Admin", email: "admin@test.com", role: "admin" }]],
    ["/api/backoffice/orders?unclosedOnly=true", [{ _id: "o1", invoiceNumber: 1, customer: { name: "Test" }, items: [], subtotal: 50, total: 63.8, status: "paid", createdAt: new Date().toISOString() }]],
  ]);

  global.fetch = jest.fn((url: string) => {
    const exact = responses.get(url);
    if (exact) return mockResponse(exact);
    for (const [pattern, data] of responses) {
      if (url.startsWith(pattern.split("?")[0])) {
        return mockResponse(data);
      }
    }
    return mockResponse([]);
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

