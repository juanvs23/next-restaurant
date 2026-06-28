import { connectDB } from "@/database/connection";
import { WorkShift } from "@/database/models/work-shift";
import { createWorkShiftSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const shifts = await WorkShift.find().sort({ sortOrder: 1 });
  return NextResponse.json(shifts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createWorkShiftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const shift = await WorkShift.create(parsed.data);
  return NextResponse.json(shift, { status: 201 });
}
