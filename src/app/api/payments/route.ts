import { connectDB } from "@/database/connection";
import { Payment } from "@/database/models/payment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  await connectDB();

  const filter: any = {};
  if (orderId) filter.orderId = orderId;

  const payments = await Payment.find(filter).sort({ paidAt: -1 });
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const payment = await Payment.create(body);
  return NextResponse.json(payment, { status: 201 });
}
