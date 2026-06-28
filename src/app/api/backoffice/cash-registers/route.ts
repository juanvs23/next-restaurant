import { connectDB } from "@/database/connection";
import { CashRegister } from "@/database/models/cash-register";
import { createCashRegisterSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const registers = await CashRegister.find().sort({ sortOrder: 1 });
  return NextResponse.json(registers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createCashRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const register = await CashRegister.create(parsed.data);
  return NextResponse.json(register, { status: 201 });
}
