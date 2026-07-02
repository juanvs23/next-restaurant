import { POST } from "@/app/api/stripe/webhook/route";
import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";

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
  Order: { findByIdAndUpdate: jest.fn() },
}));

jest.mock("@/database/models/config", () => ({
  Config: { findOneAndUpdate: jest.fn() },
}));

const mockConstructEvent = jest.fn();

jest.mock("stripe", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  })),
}));

// ── Helpers ──
function createWebhookRequest(
  rawBody: string,
  signature: string
): any {
  return {
    text: jest.fn().mockResolvedValue(rawBody),
    headers: {
      get: jest.fn((name: string) => {
        if (name === "stripe-signature") return signature;
        return null;
      }),
    },
  };
}

describe("POST /api/stripe/webhook", () => {
  const mockConfigUpdate = {
    nextInvoiceNumber: 1001,
  };

  const mockOrder = {
    _id: "order-123",
    status: "paid",
    invoiceNumber: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.STRIPE_SECRET_KEY = "sk_test_mock";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock";

    // Default: valid event
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_abc123",
          metadata: { orderId: "order-123" },
          payment_intent: "pi_test_xyz789",
        },
      },
    });

    (Config.findOneAndUpdate as jest.Mock).mockResolvedValue(mockConfigUpdate);
    (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockOrder);
  });

  // ── Signature verification ──
  it("rejects request with invalid signature", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "bad_sig");
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid signature");
  });

  it("rejects request with missing signature header", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found");
    });

    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "");
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  // ── Event processing ──
  it("returns 400 when session metadata lacks orderId", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_abc123",
          metadata: {},
          payment_intent: "pi_test_xyz789",
        },
      },
    });

    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "valid_sig");
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Missing orderId");
  });

  it("confirms payment and assigns invoice number", async () => {
    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "valid_sig");
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.received).toBe(true);

    // Verify invoice number was assigned atomically
    expect(Config.findOneAndUpdate).toHaveBeenCalledWith(
      {},
      { $inc: { nextInvoiceNumber: 1 } },
      { new: true, upsert: true }
    );

    // Verify order was updated with paid status + Stripe payment intent
    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      "order-123",
      {
        status: "paid",
        invoiceNumber: 1000,
        stripePaymentIntentId: "pi_test_xyz789",
        confirmedBy: "Stripe",
      },
      { new: true }
    );
  });

  it("stores stripePaymentIntentId on the order", async () => {
    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "valid_sig");
    await POST(req);

    const updateCall = (Order.findByIdAndUpdate as jest.Mock).mock.calls[0];
    expect(updateCall[1].stripePaymentIntentId).toBe("pi_test_xyz789");
  });

  it("returns 404 when order is not found", async () => {
    (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const req = createWebhookRequest('{"type":"checkout.session.completed"}', "valid_sig");
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Order not found");
  });

  // ── Unrelated events ──
  it("ignores non-checkout events", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: {
        object: {
          id: "pi_test_xyz789",
          metadata: {},
        },
      },
    });

    const req = createWebhookRequest('{"type":"payment_intent.created"}', "valid_sig");
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.received).toBe(true);
    // Should NOT have updated any order
    expect(Order.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
