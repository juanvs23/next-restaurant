import { connectDB } from "@/database/connection";
import { CashRegister } from "@/database/models/cash-register";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const registers = await CashRegister.find().sort({ sortOrder: 1 });
  return NextResponse.json(registers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const register = await CashRegister.create(body);
  return NextResponse.json(register, { status: 201 });
}
