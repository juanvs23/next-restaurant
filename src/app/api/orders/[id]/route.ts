import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Only admins can edit orders" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const updated = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
