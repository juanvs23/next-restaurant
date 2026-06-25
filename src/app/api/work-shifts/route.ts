import { connectDB } from "@/database/connection";
import { WorkShift } from "@/database/models/work-shift";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const shifts = await WorkShift.find().sort({ sortOrder: 1 });
  return NextResponse.json(shifts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const shift = await WorkShift.create(body);
  return NextResponse.json(shift, { status: 201 });
}
