import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Comanda } from "@/database/models/comanda";
import { DayClosing } from "@/database/models/day-closing";
import { DayOpening } from "@/database/models/day-opening";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { getDaySummary } from "@/libs/services/day-service";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  await connectDB();

  const config = await Config.findOne();
  const tz = config?.timezone || "-04:00";

  // Determine "today" in local timezone
  const now = new Date();
  const localOffset = (() => {
    const sign = tz.startsWith("-") ? -1 : 1;
    const parts = tz.replace(/[+-]/, "").split(":");
    return sign * (parseInt(parts[0]) * 60 + parseInt(parts[1]));
  })();
  const localNow = new Date(now.getTime() + (now.getTimezoneOffset() + localOffset) * 60 * 1000);
  const todayLocal = localNow.toISOString().slice(0, 10);

  // Use provided date or today in local timezone
  const dateStr = body.date || todayLocal;
  const isToday = dateStr === todayLocal;

  // Check if already closed
  const existing = await DayClosing.findOne({ date: dateStr });
  if (existing) {
    return NextResponse.json({ error: "Day already closed", closing: existing }, { status: 409 });
  }

  // Require day opening only for today
  if (isToday) {
    const opening = await DayOpening.findOne({ date: dateStr });
    if (!opening) {
      return NextResponse.json({
        error: "Day not opened",
        reason: "Open the day first before closing it.",
      }, { status: 400 });
    }
  }

  // ── Blockers ──
  const openComandas = await Comanda.countDocuments({ status: "open" });
  const pendingBills = await Order.countDocuments({ status: "pending" });

  const blockers: string[] = [];
  if (openComandas > 0) blockers.push(`${openComandas} open comanda${openComandas > 1 ? "s" : ""}`);
  if (pendingBills > 0) blockers.push(`${pendingBills} pending bill${pendingBills > 1 ? "s" : ""}`);

  if (blockers.length > 0) {
    return NextResponse.json({
      error: "Cannot close the day",
      reason: `Resolve first: ${blockers.join(" and ")}.`,
      blockers: { openComandas, pendingBills },
    }, { status: 400 });
  }

  // ── Aggregate paid orders in local day range ──
  const summary = await getDaySummary(dateStr, tz);

  const closing = await DayClosing.create({
    date: dateStr,
    closedBy: session.user?.name || session.user?.email || "unknown",
    summary,
    warnings: { openComandas: 0, pendingBills: 0 },
  });

  return NextResponse.json({ closing });
}
