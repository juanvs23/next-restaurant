import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";

export async function POST(req: NextRequest) {
  const Stripe = await import("stripe");
  const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-04-30" as any,
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.default.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Webhook: missing orderId in session metadata");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    await connectDB();

    // Atomically assign invoice number
    const config = await Config.findOneAndUpdate(
      {},
      { $inc: { nextInvoiceNumber: 1 } },
      { new: true, upsert: true }
    );

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "paid",
        invoiceNumber: config.nextInvoiceNumber - 1,
        stripePaymentIntentId: session.payment_intent,
        confirmedBy: "Stripe",
      },
      { new: true }
    );

    if (!order) {
      console.error(`Webhook: order ${orderId} not found`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(`✅ Order ${orderId} paid via Stripe. Invoice #${config.nextInvoiceNumber - 1}`);
  }

  return NextResponse.json({ received: true });
}
