import { connectDB } from "@/database/connection";
import { Charge } from "@/database/models/charge";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const charges = await Charge.find().populate("categoryIds").sort({ name: 1 });
  return NextResponse.json(charges);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const charge = await Charge.create(body);
  return NextResponse.json(charge, { status: 201 });
}
