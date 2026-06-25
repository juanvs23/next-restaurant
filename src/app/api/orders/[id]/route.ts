import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  // If confirming payment, assign sequential invoice number
  if (body.status === "paid") {
    // Atomically get and increment the invoice counter
    const config = await Config.findOneAndUpdate(
      {},
      { $inc: { nextInvoiceNumber: 1 } },
      { new: true, upsert: true }
    );
    body.invoiceNumber = config.nextInvoiceNumber - 1; // value before increment

    // Assign confirmedBy from session
    const sessionForConfirm = await auth();
    if (sessionForConfirm?.user?.name) body.confirmedBy = sessionForConfirm.user.name;
    else if (sessionForConfirm?.user?.email) body.confirmedBy = sessionForConfirm.user.email;
  }

  const updated = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
