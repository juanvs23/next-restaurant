import { connectDB } from "@/database/connection";
import { Turn } from "@/database/models/turn";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const turns = await Turn.find().sort({ sortOrder: 1 });
  return NextResponse.json(turns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const turn = await Turn.create(body);
  return NextResponse.json(turn, { status: 201 });
}
