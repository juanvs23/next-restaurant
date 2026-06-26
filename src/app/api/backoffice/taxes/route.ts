import { connectDB } from "@/database/connection";
import { Tax } from "@/database/models/tax";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const taxes = await Tax.find().populate("categoryIds").sort({ name: 1 });
  return NextResponse.json(taxes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const tax = await Tax.create(body);
  return NextResponse.json(tax, { status: 201 });
}
