import { connectDB } from "@/database/connection";
import { Tax } from "@/database/models/tax";
import { createTaxSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const taxes = await Tax.find().populate("categoryIds").sort({ name: 1 });
  return NextResponse.json(taxes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createTaxSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const tax = await Tax.create(parsed.data);
  return NextResponse.json(tax, { status: 201 });
}
