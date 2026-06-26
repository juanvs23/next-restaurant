import { connectDB } from "@/database/connection";
import { CreditNote } from "@/database/models/credit-note";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const notes = await CreditNote.find().sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  // Validate original order
  const order = await Order.findById(body.originalOrderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Can only issue credit notes for paid orders" }, { status: 400 });
  }

  // Validate amount
  const amount = Number(body.amount);
  if (amount <= 0 || amount > order.total) {
    return NextResponse.json({
      error: `Amount must be between 0.01 and ${order.total.toFixed(2)} (the original total)`,
    }, { status: 400 });
  }

  if (!body.reason?.trim()) {
    return NextResponse.json({ error: "Reason is required" }, { status: 400 });
  }

  // Calculate proportional tax
  const taxAmount = order.total > 0
    ? Math.round((order.totalTax / order.total) * amount * 100) / 100
    : 0;

  // Atomically get next credit note number
  const config = await Config.findOneAndUpdate(
    {},
    { $inc: { nextCreditNoteNumber: 1 } },
    { new: true, upsert: true }
  );

  const note = await CreditNote.create({
    creditNoteNumber: config.nextCreditNoteNumber - 1,
    originalOrderId: order._id,
    originalInvoiceNumber: order.invoiceNumber,
    customerName: order.customer?.name || "Walk-in",
    amount,
    taxAmount,
    total: amount + taxAmount,
    reason: body.reason.trim(),
    createdBy: session.user?.name || session.user?.email || "unknown",
    items: order.items?.map((i: any) => ({
      name: i.name, quantity: i.quantity, price: i.price,
    })) || [],
  });

  return NextResponse.json(note, { status: 201 });
}
