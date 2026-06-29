import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { updateOrderStatusSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  // If items are updated, recalculate totals and convert to VES
  if (parsed.data.items && parsed.data.items.length > 0) {
    const config = await Config.findOne();
    const exchangeRateBcv = config?.exchangeRateBcv || 0;

    // Subtotal in USD from item prices
    const subtotalUsd = parsed.data.items.reduce(
      (s: number, it: any) => s + (it.price || 0) * (it.quantity || 1),
      0
    );

    // Total in VES using current exchange rate (frozen at edit time)
    const totalVes = exchangeRateBcv > 0
      ? Math.round(subtotalUsd * exchangeRateBcv * 100) / 100
      : 0;

    parsed.data.subtotal = totalVes;
    parsed.data.total = totalVes;
    parsed.data.totalUsdRef = Math.round(subtotalUsd * 100) / 100;
    parsed.data.exchangeRateBcv = exchangeRateBcv;
    parsed.data.totalTax = 0;
    parsed.data.totalCharge = 0;
  }

  // If confirming payment, assign sequential invoice number
  if (parsed.data.status === "paid") {
    // Atomically get and increment the invoice counter
    const config = await Config.findOneAndUpdate(
      {},
      { $inc: { nextInvoiceNumber: 1 } },
      { new: true, upsert: true }
    );
    parsed.data.invoiceNumber = config.nextInvoiceNumber - 1; // value before increment

    // Assign confirmedBy from session
    const sessionForConfirm = await auth();
    if (sessionForConfirm?.user?.name) parsed.data.confirmedBy = sessionForConfirm.user.name;
    else if (sessionForConfirm?.user?.email) parsed.data.confirmedBy = sessionForConfirm.user.email;
  }

  const updated = await Order.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
