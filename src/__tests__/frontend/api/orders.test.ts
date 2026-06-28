import { POST } from "@/app/api/frontend/orders/route";
import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { mockConfig } from "@/__tests__/helpers/mock-db";

// ── Module mocks ──
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: any) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));
jest.mock("@/database/connection", () => ({
  connectDB: jest.fn(),
}));

jest.mock("@/database/models/order", () => ({
  Order: { create: jest.fn() },
}));

jest.mock("@/database/models/config", () => ({
  Config: { findOne: jest.fn() },
}));

function mockQueryChain(resolvedValue: any) {
  return {
    lean: jest.fn().mockResolvedValue(resolvedValue),
  };
}

function createOrderRequest(body: any): any {
  return {
    url: "http://localhost/api/frontend/orders",
    json: jest.fn().mockResolvedValue(body),
  };
}

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
    {
      productId: "507f1f77bcf86cd799439012",
      productName: "Agua Mineral",
      price: 2,
      quantity: 1,
    },
  ],
  notes: "Sin hielo por favor",
};

const mockCreatedOrder = {
  _id: { toString: () => "order-123" },
  status: "pending",
  total: 438, // 12 * 36.5
  totalUsdRef: 12,
  exchangeRateBcv: 36.5,
};

describe("POST /api/frontend/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain(mockConfig)
    );
    (Order.create as jest.Mock).mockResolvedValue(mockCreatedOrder);
  });

  it("creates an order with source: frontend and status: pending", async () => {
    const response = await POST(createOrderRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(connectDB).toHaveBeenCalled();

    // Verify Order.create was called with correct params
    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    expect(createCall.source).toBe("frontend");
    expect(createCall.status).toBe("pending");
  });

  it("freezes exchangeRateBcv at order time", async () => {
    await POST(createOrderRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    expect(createCall.exchangeRateBcv).toBe(36.5);
  });

  it("calculates total correctly (USD and VES)", async () => {
    await POST(createOrderRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];

    // 5*2 + 2*1 = 12 USD
    expect(createCall.totalUsdRef).toBe(12);

    // 12 * 36.5 = 438 VES
    expect(createCall.total).toBe(438);
  });

  it("stores customer info on the order", async () => {
    await POST(createOrderRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    expect(createCall.customer).toEqual({
      name: "Juan Pérez",
      email: "",
      phone: "+584141234567",
    });
  });

  it("rejects empty cart (no items)", async () => {
    const payload = {
      customer: { name: "Test", phone: "+584141234567" },
      items: [],
    };

    const response = await POST(createOrderRequest(payload));
    expect(response.status).toBe(400);
  });

  it("rejects missing customer name", async () => {
    const payload = {
      customer: { phone: "+584141234567" },
      items: [
        {
          productId: "507f1f77bcf86cd799439011",
          productName: "Test",
          price: 10,
          quantity: 1,
        },
      ],
    };

    const response = await POST(createOrderRequest(payload));
    expect(response.status).toBe(400);
  });

  it("rejects invalid phone", async () => {
    const payload = {
      customer: { name: "Test", phone: "abc" },
      items: [
        {
          productId: "507f1f77bcf86cd799439011",
          productName: "Test",
          price: 10,
          quantity: 1,
        },
      ],
    };

    const response = await POST(createOrderRequest(payload));
    expect(response.status).toBe(400);
  });

  it("returns 500 on database error", async () => {
    (Order.create as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const response = await POST(createOrderRequest(validPayload));
    expect(response.status).toBe(500);
  });
});
