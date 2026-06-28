import { connectDB } from "@/database/connection";
import { Turn } from "@/database/models/turn";
import { createTurnSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const turns = await Turn.find().sort({ sortOrder: 1 });
  return NextResponse.json(turns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createTurnSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const turn = await Turn.create(parsed.data);
  return NextResponse.json(turn, { status: 201 });
}
