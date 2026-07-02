import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { checkoutSchema } from "@/schemas/frontend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const config = await Config.findOne().lean();
    const exchangeRateBcv = config?.exchangeRateBcv ?? 0;

    if (!exchangeRateBcv || exchangeRateBcv <= 0) {
      return NextResponse.json(
        { error: "Exchange rate not configured. Orders are temporarily unavailable." },
        { status: 503 }
      );
    }

    // ── Build order items ──
    const items = parsed.data.items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      taxRate: 0,
      taxBreakdown: [],
    }));

    const totalUsd = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalUsdRef = Math.round(totalUsd * 100) / 100;
    const totalVes = Math.round(totalUsdRef * exchangeRateBcv * 100) / 100;

    // ── Create order (pending, source: frontend, paymentMethod: stripe) ──
    const order = await Order.create({
      items,
      customer: {
        name: parsed.data.customer.name,
        email: parsed.data.customer.email ?? "",
        phone: parsed.data.customer.phone,
      },
      notes: parsed.data.notes ?? "",
      source: "frontend",
      status: "pending",
      paymentMethod: "Stripe",
      paymentType: "stripe",
      total: totalVes,
      totalUsdRef,
      exchangeRateBcv,
      subtotal: totalVes,
      totalTax: 0,
      totalCharge: 0,
    });

    // ── Create Stripe Checkout Session ──
    const Stripe = await import("stripe");
    const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30" as any,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: parsed.data.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.productName },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      })),
      customer_email: parsed.data.customer.email || undefined,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=true`,
    });

    // ── Store Stripe session ID on the order ──
    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("POST /api/stripe/checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
