import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const order = await Order.create(body);
  return NextResponse.json(order, { status: 201 });
}
