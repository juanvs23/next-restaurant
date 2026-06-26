import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { TableModel } from "@/database/models/table";
import { NextRequest, NextResponse } from "next/server";

/**
 * Check table availability for a given date and time range.
 * A table is available if its bookings don't overlap with [arrival, departure].
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");         // "2026-07-01"
  const arrival = searchParams.get("arrival");    // "19:00"
  const departure = searchParams.get("departure"); // "22:00"
  const persons = parseInt(searchParams.get("persons") || "2");

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  await connectDB();

  // All candidate tables
  const candidateTables = await TableModel.find({
    capacity: { $gte: persons },
    status: { $ne: "maintenance" },
  });

  // If no arrival/departure specified, return all candidate tables
  if (!arrival || !departure) {
    return NextResponse.json({
      available: candidateTables,
      total: candidateTables.length,
      date,
    });
  }

  // Find bookings on this date that have overlapping time ranges
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  const bookings = await Booking.find({
    dateTime: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["pending", "confirmed"] },
  });

  // Filter tables that have NO overlapping booking
  const available = candidateTables.filter((table: any) => {
    const tableId = table._id.toString();

    const hasOverlap = bookings.some((b: any) => {
      if (b.tableId?.toString() !== tableId) return false;

      const bArrival = b.arrivalTime;
      const bDeparture = b.departureTime;

      // If the existing booking has no time range, skip (can't check)
      if (!bArrival || !bDeparture) return false;

      // Overlap: A1 < B2 AND A2 > B1
      return arrival < bDeparture && departure > bArrival;
    });

    return !hasOverlap;
  });

  return NextResponse.json({
    available,
    total: candidateTables.length,
    date,
    arrival,
    departure,
  });
}
