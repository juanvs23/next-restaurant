import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { DayClosing } from "@/database/models/day-closing";
import { DayOpening } from "@/database/models/day-opening";
import { Config } from "@/database/models/config";
import { getLocalDayRange } from "@/libs/timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const config = await Config.findOne();
  const tz = config?.timezone || "-04:00";

  // Determine today in local tz
  const now = new Date();
  const localOffset = (() => {
    const sign = tz.startsWith("-") ? -1 : 1;
    const parts = tz.replace(/[+-]/, "").split(":");
    return sign * (parseInt(parts[0]) * 60 + parseInt(parts[1]));
  })();
  const todayLocal = new Date(now.getTime() + (now.getTimezoneOffset() + localOffset) * 60 * 1000)
    .toISOString().slice(0, 10);

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") || todayLocal.slice(0, 4));
  const month = parseInt(searchParams.get("month") || String(parseInt(todayLocal.slice(5, 7))));

  // Month range in local timezone
  const monthStartStr = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextMonthYear = month === 12 ? year + 1 : year;
  const monthEndStr = `${nextMonthYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const { start: monthStart, end: monthEnd } = getLocalDayRange(monthStartStr, tz);
  // monthEnd needs to be the start of the next month in local tz
  const { start: nextMonthStart } = getLocalDayRange(monthEndStr, tz);

  const match = {
    status: "paid",
    createdAt: { $gte: monthStart, $lt: nextMonthStart },
  };

  const [summaryResult, dailyResult, paymentResult, productResult, closings, todayOpening] = await Promise.all([
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
      { $sort: { _id: 1 } },
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
      date: { $gte: monthStartStr, $lt: monthEndStr },
    }).sort({ date: 1 }).lean(),

    DayOpening.findOne({ date: todayLocal }).lean(),
  ]);

  const summary = summaryResult[0] || {
    totalOrders: 0, totalRevenue: 0, totalSubtotal: 0,
    totalTax: 0, totalCharges: 0, avgTicket: 0,
  };

  const closedDates = new Set(closings.map((c: any) => c.date));
  const isTodayClosed = closedDates.has(todayLocal);
  const isTodayOpen = !!todayOpening;

  return NextResponse.json({
    period: { year, month },
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
