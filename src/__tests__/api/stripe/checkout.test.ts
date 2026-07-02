import { POST } from "@/app/api/stripe/checkout/route";
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

// Mock Stripe — constructor returns object with checkout.sessions.create
const mockCreateSession = jest.fn();

jest.mock("stripe", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    checkout: {
      sessions: {
        create: mockCreateSession,
      },
    },
  })),
}));

// ── Helpers ──
function mockQueryChain(resolvedValue: any) {
  return {
    lean: jest.fn().mockResolvedValue(resolvedValue),
  };
}

function createRequest(body: any): any {
  return {
    url: "http://localhost/api/stripe/checkout",
    json: jest.fn().mockResolvedValue(body),
  };
}

const validPayload = {
  customer: {
    name: "María García",
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
  notes: "Dirección: Calle 1, Caracas",
  paymentMethod: "stripe",
};

const mockCreatedOrder = {
  _id: { toString: () => "order-123" },
  status: "pending",
  total: 438,
  totalUsdRef: 12,
  exchangeRateBcv: 36.5,
  save: jest.fn().mockResolvedValue(true),
};

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain(mockConfig)
    );
    (Order.create as jest.Mock).mockResolvedValue(mockCreatedOrder);

    // Default: successful Stripe session creation
    mockCreateSession.mockResolvedValue({
      id: "cs_test_abc123",
      url: "https://checkout.stripe.com/pay/cs_test_abc123",
    });

    process.env.STRIPE_SECRET_KEY = "sk_test_mock";
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  // ── Validation ──
  it("rejects empty cart", async () => {
    const payload = {
      customer: { name: "Test", phone: "+584141234567" },
      items: [],
      paymentMethod: "stripe",
    };

    const response = await POST(createRequest(payload));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("rejects missing customer name", async () => {
    const payload = {
      customer: { phone: "+584141234567" },
      items: [
        { productId: "507f1f77bcf86cd799439011", productName: "Test", price: 10, quantity: 1 },
      ],
      paymentMethod: "stripe",
    };

    const response = await POST(createRequest(payload));
    expect(response.status).toBe(400);
  });

  it("rejects invalid phone number", async () => {
    const payload = {
      customer: { name: "Test", phone: "abc" },
      items: [
        { productId: "507f1f77bcf86cd799439011", productName: "Test", price: 10, quantity: 1 },
      ],
      paymentMethod: "stripe",
    };

    const response = await POST(createRequest(payload));
    expect(response.status).toBe(400);
  });

  // ── Exchange rate ──
  it("returns 503 when exchange rate is not configured", async () => {
    (Config.findOne as jest.Mock).mockReturnValue(
      mockQueryChain({ exchangeRateBcv: 0 })
    );

    const response = await POST(createRequest(validPayload));
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error).toContain("Exchange rate not configured");
  });

  // ── Success ──
  it("creates order with source: frontend and status: pending", async () => {
    await POST(createRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    expect(createCall.source).toBe("frontend");
    expect(createCall.status).toBe("pending");
    expect(createCall.paymentMethod).toBe("Stripe");
    expect(createCall.paymentType).toBe("stripe");
  });

  it("calculates totals correctly (USD and VES)", async () => {
    await POST(createRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    // 5*2 + 2*1 = 12 USD
    expect(createCall.totalUsdRef).toBe(12);
    // 12 * 36.5 = 438 VES
    expect(createCall.total).toBe(438);
  });

  it("freezes exchangeRateBcv and stores customer info", async () => {
    await POST(createRequest(validPayload));

    const createCall = (Order.create as jest.Mock).mock.calls[0][0];
    expect(createCall.exchangeRateBcv).toBe(36.5);
    expect(createCall.customer.name).toBe("María García");
    expect(createCall.customer.phone).toBe("+584141234567");
  });

  it("creates Stripe Checkout Session with correct line items", async () => {
    await POST(createRequest(validPayload));

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    const sessionArgs = mockCreateSession.mock.calls[0][0];
    expect(sessionArgs.mode).toBe("payment");
    expect(sessionArgs.line_items).toHaveLength(2);
    expect(sessionArgs.line_items[0].price_data.product_data.name).toBe("Jugo de Naranja");
    expect(sessionArgs.line_items[0].price_data.unit_amount).toBe(500); // $5 * 100
    expect(sessionArgs.metadata.orderId).toBe("order-123");
  });

  it("uses success_url and cancel_url from env", async () => {
    await POST(createRequest(validPayload));

    const sessionArgs = mockCreateSession.mock.calls[0][0];
    expect(sessionArgs.success_url).toContain("localhost:3000");
    expect(sessionArgs.success_url).toContain("/checkout/success");
    expect(sessionArgs.cancel_url).toContain("/checkout?canceled=true");
  });

  it("stores Stripe session ID on the order", async () => {
    await POST(createRequest(validPayload));

    expect(mockCreatedOrder.save).toHaveBeenCalled();
    expect(mockCreatedOrder.stripeSessionId).toBe("cs_test_abc123");
  });

  it("returns the Stripe checkout URL", async () => {
    const response = await POST(createRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.url).toBe("https://checkout.stripe.com/pay/cs_test_abc123");
    expect(body.sessionId).toBe("cs_test_abc123");
  });

  // ── Error handling ──
  it("returns 500 on Stripe API failure", async () => {
    mockCreateSession.mockRejectedValue(new Error("Stripe API error"));

    const response = await POST(createRequest(validPayload));
    expect(response.status).toBe(500);
  });

  it("returns 500 on database error", async () => {
    (Order.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    const response = await POST(createRequest(validPayload));
    expect(response.status).toBe(500);
  });
});
