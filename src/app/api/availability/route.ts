import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { TableModel } from "@/database/models/table";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const turnTime = searchParams.get("turnTime");
  const persons = parseInt(searchParams.get("persons") || "2");

  if (!date || !turnTime) {
    return NextResponse.json(
      { error: "date and turnTime are required" },
      { status: 400 }
    );
  }

  await connectDB();

  // Find tables that fit the party size
  const candidateTables = await TableModel.find({
    capacity: { $gte: persons },
    status: { $ne: "maintenance" },
  });

  // Match the full day in local time (stored as UTC)
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59.999`);

  const bookings = await Booking.find({
    dateTime: { $gte: start, $lte: end },
    turnTime,
    status: { $in: ["pending", "confirmed"] },
  });

  const bookedTableIds = bookings
    .filter((b: any) => b.tableId)
    .map((b: any) => b.tableId?.toString());

  const available = candidateTables.filter(
    (t: any) => !bookedTableIds.includes(t._id.toString())
  );

  return NextResponse.json({ available, total: candidateTables.length });
}
