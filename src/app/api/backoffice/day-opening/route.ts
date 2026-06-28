import { connectDB } from "@/database/connection";
import { DayOpening } from "@/database/models/day-opening";
import { DayClosing } from "@/database/models/day-closing";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { createDayOpeningSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";
import { validateSequentialOpen } from "@/libs/services/day-service";

function getLocalToday(tz: string): string {
  const now = new Date();
  const sign = tz.startsWith("-") ? -1 : 1;
  const parts = tz.replace(/[+-]/, "").split(":");
  const offset = sign * (parseInt(parts[0]) * 60 + parseInt(parts[1]));
  const local = new Date(now.getTime() + (now.getTimezoneOffset() + offset) * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export async function GET() {
  await connectDB();
  const openings = await DayOpening.find().populate("workShiftId").sort({ date: -1 });
  return NextResponse.json(openings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createDayOpeningSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const config = await Config.findOne();
  const tz = config?.timezone || "-04:00";
  const dateStr = getLocalToday(tz);

  // Check if already opened
  const existing = await DayOpening.findOne({ date: dateStr });
  if (existing) {
    return NextResponse.json({ error: "Day already opened", opening: existing }, { status: 409 });
  }

  // Check if already closed
  const closed = await DayClosing.findOne({ date: dateStr });
  if (closed) {
    return NextResponse.json({ error: "Cannot open a day that is already closed" }, { status: 400 });
  }

  // Check previous working day is closed (all dates are local)
  const nonWorkingDays = config?.nonWorkingDays ?? [0];
  const holidays = config?.holidays ?? [];

  const blockingDate = await validateSequentialOpen(dateStr, nonWorkingDays, holidays);
  if (blockingDate) {
    return NextResponse.json({
      error: "Previous day not closed",
      reason: `Close ${blockingDate} first before opening today.`,
      blockingDate,
    }, { status: 400 });
  }

  const opening = await DayOpening.create({
    date: dateStr,
    openedBy: session.user?.name || session.user?.email || "unknown",
    workShiftId: parsed.data.workShiftId || undefined,
    notes: parsed.data.notes || "",
  });

  return NextResponse.json(opening, { status: 201 });
}
