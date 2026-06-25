import { connectDB } from "@/database/connection";
import { DayClosing } from "@/database/models/day-closing";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const closings = await DayClosing.find({}, { date: 1, summary: 1, closedBy: 1 })
    .sort({ date: -1 })
    .lean();
  return NextResponse.json(closings);
}
