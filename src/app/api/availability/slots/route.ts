import { connectDB } from "@/database/connection";
import { Turn } from "@/database/models/turn";
import { Booking } from "@/database/models/booking";
import { TableModel } from "@/database/models/table";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns available time slots for a given date, grouped by turn.
 * Slots are 1-hour intervals within each turn's operating hours.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const persons = parseInt(searchParams.get("persons") || "2");

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  await connectDB();

  // All active turns
  const turns = await Turn.find({ active: true }).sort({ sortOrder: 1 });

  // All candidate tables
  const candidateTables = await TableModel.find({
    capacity: { $gte: persons },
    status: { $ne: "maintenance" },
  });

  // Bookings for this date
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);
  const bookings = await Booking.find({
    dateTime: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ["pending", "confirmed"] },
  });

  // Generate slots per turn
  const slotsByTurn = turns.map((turn: any) => {
    const startHour = parseInt(turn.startTime.split(":")[0]);
    const endHour = parseInt(turn.endTime.split(":")[0]);
    const slots: { time: string; available: number }[] = [];

    for (let h = startHour; h < endHour; h++) {
      const slotStart = `${h.toString().padStart(2, "0")}:00`;
      const slotEnd = `${(h + 1).toString().padStart(2, "0")}:00`;

      // Count tables not booked during this slot
      const available = candidateTables.filter((table: any) => {
        const tableId = table._id.toString();
        const hasOverlap = bookings.some((b: any) => {
          if (b.tableId?.toString() !== tableId) return false;
          if (!b.arrivalTime || !b.departureTime) return false;
          return slotStart < b.departureTime && slotEnd > b.arrivalTime;
        });
        return !hasOverlap;
      });

      slots.push({ time: slotStart, available: available.length });
    }

    return {
      turnId: turn._id,
      name: turn.name,
      label: turn.label,
      color: turn.color,
      startTime: turn.startTime,
      endTime: turn.endTime,
      slots,
    };
  });

  return NextResponse.json({ date, persons, turns: slotsByTurn });
}
