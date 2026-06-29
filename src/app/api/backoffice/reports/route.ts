import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { DayClosing } from "@/database/models/day-closing";
import { DayOpening } from "@/database/models/day-opening";
import { Config } from "@/database/models/config";
import { getLocalDayRange } from "@/libs/timezone";
import { NextRequest, NextResponse } from "next/server";

function localToday(tz: string): string {
  const now = new Date();
  const sign = tz.startsWith("-") ? -1 : 1;
  const parts = tz.replace(/[+-]/, "").split(":");
  const offset = sign * (parseInt(parts[0]) * 60 + parseInt(parts[1]));
  const local = new Date(now.getTime() + (now.getTimezoneOffset() + offset) * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  await connectDB();

  const config = await Config.findOne();
  const tz = config?.timezone || "-04:00";
  const todayLocal = localToday(tz);

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "month";
  let date = searchParams.get("date") || todayLocal;

  // ── Compute date range based on period ──
  let rangeStart: Date;
  let rangeEnd: Date;
  let closingsStartStr: string;
  let closingsEndStr: string;

  if (period === "day") {
    const { start, end } = getLocalDayRange(date, tz);
    rangeStart = start;
    rangeEnd = end;
    closingsStartStr = date;
    closingsEndStr = offsetDate(date, 1);
  } else if (period === "week") {
    // Week: 7 days ending on `date` (inclusive)
    const weekEnd = offsetDate(date, 1); // exclusive end
    const weekStart = offsetDate(date, -6); // 7 days ago
    const { start } = getLocalDayRange(weekStart, tz);
    const { start: end } = getLocalDayRange(weekEnd, tz);
    rangeStart = start;
    rangeEnd = end;
    closingsStartStr = weekStart;
    closingsEndStr = offsetDate(date, 1); // month end of week for closings query
  } else {
    // Month (default, backward compat)
    const year = parseInt(searchParams.get("year") || todayLocal.slice(0, 4));
    const month = parseInt(searchParams.get("month") || String(parseInt(todayLocal.slice(5, 7))));
    const monthStartStr = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextMonthYear = month === 12 ? year + 1 : year;
    const monthEndStr = `${nextMonthYear}-${String(nextMonth).padStart(2, "0")}-01`;
    const { start } = getLocalDayRange(monthStartStr, tz);
    const { start: nextMonthStart } = getLocalDayRange(monthEndStr, tz);
    rangeStart = start;
    rangeEnd = nextMonthStart;
    closingsStartStr = monthStartStr;
    closingsEndStr = monthEndStr;
    date = monthStartStr; // for period field in response
  }

  const match = {
    status: "paid",
    createdAt: { $gte: rangeStart, $lt: rangeEnd },
  };

  const [summaryResult, dailyResult, paymentResult, productResult, closings, openings, todayOpening] = await Promise.all([
    Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          totalSubtotal: { $sum: "$subtotal" },
          totalTax: { $sum: "$totalTax" },
          totalCharges: { $sum: "$totalCharge" },
          avgTicket: { $avg: "$total" },
        },
      },
    ]),

    // Group by local date using MongoDB timezone support
    Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: tz,
            },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
          tax: { $sum: "$totalTax" },
          charges: { $sum: "$totalCharge" },
          subtotal: { $sum: "$subtotal" },
        },
      },
      { $sort: { _id: -1 } },
    ]),

    Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ["$paymentType", "$paymentMethod", "unknown"] },
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      { $sort: { total: -1 } },
    ]),

    Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 },
    ]),

    DayClosing.find({
      date: { $gte: closingsStartStr, $lt: closingsEndStr },
    }).sort({ date: -1 }).lean(),

    DayOpening.find({
      date: { $gte: closingsStartStr, $lt: closingsEndStr },
    }).sort({ date: -1 }).lean(),

    DayOpening.findOne({ date: todayLocal }).lean(),
  ]);

  const summary = summaryResult[0] || {
    totalOrders: 0, totalRevenue: 0, totalSubtotal: 0,
    totalTax: 0, totalCharges: 0, avgTicket: 0,
  };

  const closedDates = new Set(closings.map((c: any) => c.date));
  const isTodayClosed = closedDates.has(todayLocal);
  const isTodayOpen = !!todayOpening;

  // Merge closing dates that have no paid orders into byDay
  const currentDates = new Set(dailyResult.map((d: any) => d._id));
  for (const c of closings) {
    if (!currentDates.has(c.date)) {
      dailyResult.push({
        _id: c.date, orders: 0, revenue: 0, tax: 0, charges: 0, subtotal: 0,
      });
    }
  }
  // Merge open days (not closed, no orders) into byDay
  for (const o of openings) {
    if (!currentDates.has(o.date) && !closedDates.has(o.date)) {
      dailyResult.push({
        _id: o.date, orders: 0, revenue: 0, tax: 0, charges: 0, subtotal: 0,
      });
    }
  }
  // Sort descending: most recent first
  dailyResult.sort((a: any, b: any) => b._id.localeCompare(a._id));

  return NextResponse.json({
    period: period === "day" ? { period, date } : period === "week" ? { period, endDate: date } : { period, year: parseInt(date.slice(0, 4)), month: parseInt(date.slice(5, 7)) },
    dayStatus: {
      isOpen: isTodayOpen,
      isClosed: isTodayClosed,
      openedBy: (todayOpening as any)?.openedBy,
      openedAt: (todayOpening as any)?.openedAt,
    },
    closings: {
      dates: Array.from(closedDates),
      isTodayClosed,
      details: closings,
    },
    summary: {
      ...summary,
      avgTicket: Math.round(summary.avgTicket * 100) / 100,
    },
    byDay: dailyResult,
    byPaymentType: paymentResult,
    topProducts: productResult,
  });
}
