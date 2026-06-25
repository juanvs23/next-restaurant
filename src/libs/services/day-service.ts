import { DayClosing } from "@/database/models/day-closing";
import { Order } from "@/database/models/order";
import { getLocalDayRange } from "@/libs/timezone";

/**
 * Check whether a given date is a non-working day (weekend or holiday).
 *
 * Holidays can be:
 *   - "MM-DD" (yearly recurring, e.g. "12-25")
 *   - "YYYY-MM-DD" (one-time, e.g. "2026-06-15")
 *
 * Extracted from POST /api/day-opening (line 63).
 */
export function isNonWorkingDay(
  date: Date,
  nonWorkingDays: number[],
  holidays: string[],
): boolean {
  if (nonWorkingDays.includes(date.getDay())) return true;
  const mmdd = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const yyyymmdd = date.toISOString().slice(0, 10);
  return holidays.includes(mmdd) || holidays.includes(yyyymmdd);
}

/**
 * Walk backwards from `dateStr` (up to 30 days) and return the first
 * working day that does NOT have a DayClosing record, or `null` if all
 * previous working days are properly closed.
 *
 * Used when opening a new day — every working day before today must be
 * closed before allowing a new opening.
 *
 * Extracted from POST /api/day-opening (lines 48–77).
 */
export async function validateSequentialOpen(
  dateStr: string,
  nonWorkingDays: number[],
  holidays: string[],
): Promise<string | null> {
  return findFirstUnclosedWorkingDay(dateStr, nonWorkingDays, holidays);
}

/**
 * Same sequential check used when closing a day — ensures no working day
 * before `dateStr` was left unclosed.
 *
 * Extracted from POST /api/reports/close.
 */
export async function validateSequentialClose(
  dateStr: string,
  nonWorkingDays: number[],
  holidays: string[],
): Promise<string | null> {
  return findFirstUnclosedWorkingDay(dateStr, nonWorkingDays, holidays);
}

/**
 * Internal: walk backwards from the day before `dateStr` and return the
 * first working day missing a DayClosing record, or `null`.
 */
async function findFirstUnclosedWorkingDay(
  dateStr: string,
  nonWorkingDays: number[],
  holidays: string[],
): Promise<string | null> {
  const [curYear, curMonth, curDay] = dateStr.split("-").map(Number);
  let checkDate = new Date(curYear, curMonth - 1, curDay - 1);

  for (let i = 0; i < 30; i++) {
    const checkDay = checkDate.getDay();
    const yyyy = checkDate.getFullYear();
    const mm = String(checkDate.getMonth() + 1).padStart(2, "0");
    const dd = String(checkDate.getDate()).padStart(2, "0");
    const mmdd = `${mm}-${dd}`;
    const checkStr = `${yyyy}-${mm}-${dd}`;
    const isNonWorking =
      nonWorkingDays.includes(checkDay) ||
      holidays.includes(mmdd) ||
      holidays.includes(checkStr);

    if (!isNonWorking) {
      const prevClosed = await DayClosing.findOne({ date: checkStr });
      if (!prevClosed) {
        return checkStr;
      }
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return null;
}

/**
 * Aggregate paid orders for a given local date and return a summary object.
 *
 * Extracted from POST /api/reports/close (lines 72–96).
 */
export async function getDaySummary(
  dateStr: string,
  tz: string,
): Promise<{
  totalOrders: number;
  totalRevenue: number;
  totalSubtotal: number;
  totalTax: number;
  totalCharges: number;
  avgTicket: number;
}> {
  const { start, end } = getLocalDayRange(dateStr, tz);

  const [summaryResult] = await Order.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: start, $lt: end },
      },
    },
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
  ]);

  const summary = summaryResult || {
    totalOrders: 0,
    totalRevenue: 0,
    totalSubtotal: 0,
    totalTax: 0,
    totalCharges: 0,
    avgTicket: 0,
  };
  summary.avgTicket = Math.round(summary.avgTicket * 100) / 100;

  return summary;
}
