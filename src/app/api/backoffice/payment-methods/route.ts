import { connectDB } from "@/database/connection";
import { PaymentMethod, PAYMENT_METHOD_DEFAULTS } from "@/database/models/payment-method";
import { createPaymentMethodSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  let methods = await PaymentMethod.find().sort({ sortOrder: 1 });

  // Seed defaults on first access
  if (methods.length === 0) {
    await PaymentMethod.insertMany(PAYMENT_METHOD_DEFAULTS);
    methods = await PaymentMethod.find().sort({ sortOrder: 1 });
  }

  return NextResponse.json(methods);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createPaymentMethodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const existing = await PaymentMethod.findOne({ type: parsed.data.type });
  if (existing) {
    return NextResponse.json({ error: `A method with type "${parsed.data.type}" already exists` }, { status: 409 });
  }

  const method = await PaymentMethod.create(parsed.data);
  return NextResponse.json(method, { status: 201 });
}
