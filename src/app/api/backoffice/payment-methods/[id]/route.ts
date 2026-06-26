import { connectDB } from "@/database/connection";
import { PaymentMethod } from "@/database/models/payment-method";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();

  // If deactivating, ensure at least 1 other active method remains
  if (body.active === false) {
    const current = await PaymentMethod.findById(id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (current.active) {
      const activeCount = await PaymentMethod.countDocuments({ _id: { $ne: id }, active: true });
      if (activeCount < 1) {
        return NextResponse.json(
          { error: "At least one payment method must remain active" },
          { status: 400 }
        );
      }
    }
  }

  const updated = await PaymentMethod.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const method = await PaymentMethod.findById(id);
  if (!method) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cannot delete the last active method
  const activeCount = await PaymentMethod.countDocuments({ _id: { $ne: id }, active: true });
  if (activeCount < 1) {
    return NextResponse.json(
      { error: "Cannot delete the only active payment method" },
      { status: 400 }
    );
  }

  await PaymentMethod.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
