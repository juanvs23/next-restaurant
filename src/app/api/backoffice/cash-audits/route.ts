import { connectDB } from "@/database/connection";
import { CashAudit } from "@/database/models/cash-audit";
import { Order } from "@/database/models/order";
import { WorkShift } from "@/database/models/work-shift";
import { Config } from "@/database/models/config";
import { getLocalDayRange } from "@/libs/timezone";
import { auth } from "@/app/auth";
import { createCashAuditSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const audits = await CashAudit.find()
    .populate("workShiftId")
    .sort({ createdAt: -1 });
  return NextResponse.json(audits);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.role || !["admin", "staff"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createCashAuditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const [config, ws] = await Promise.all([
    Config.findOne(),
    parsed.data.workShiftId ? WorkShift.findById(parsed.data.workShiftId) : null,
  ]);

  const tz = config?.timezone || "-04:00";
  const workShiftName = ws?.name || "";

  // Today in local timezone
  const now = new Date();
  const localOffset = (() => {
    const sign = tz.startsWith("-") ? -1 : 1;
    const parts = tz.replace(/[+-]/, "").split(":");
    return sign * (parseInt(parts[0]) * 60 + parseInt(parts[1]));
  })();
  const dateStr = new Date(now.getTime() + (now.getTimezoneOffset() + localOffset) * 60 * 1000)
    .toISOString().slice(0, 10);

  const { start, end } = getLocalDayRange(dateStr, tz);

  // Expected cash: cash payments in local day range
  const [cashResult] = await Order.aggregate([
    {
      $match: {
        status: "paid",
        paymentType: "cash",
        createdAt: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  const expectedCash = cashResult?.total || 0;
  const declaredCash = Number(parsed.data.declaredCash);

  const audit = await CashAudit.create({
    date: dateStr,
    workShiftId: parsed.data.workShiftId || undefined,
    workShiftName,
    expectedCash,
    declaredCash,
    difference: Math.round((declaredCash - expectedCash) * 100) / 100,
    notes: parsed.data.notes || "",
    createdBy: session.user?.name || session.user?.email || "unknown",
  });

  return NextResponse.json(audit, { status: 201 });
}
