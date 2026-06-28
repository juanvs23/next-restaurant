import { connectDB } from "@/database/connection";
import { Charge } from "@/database/models/charge";
import { createChargeSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const charges = await Charge.find().populate("categoryIds").sort({ name: 1 });
  return NextResponse.json(charges);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createChargeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const charge = await Charge.create(parsed.data);
  return NextResponse.json(charge, { status: 201 });
}
