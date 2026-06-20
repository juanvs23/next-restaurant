import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectDB();
  const booking = await Booking.findById(id).populate("tableId").lean();

  if (!booking) {
    return NextResponse.json({ valid: false, error: "Booking not found" }, { status: 404 });
  }

  const b = booking as any;
  const now = new Date();
  const bookingDate = new Date(b.dateTime);
  const isExpired = bookingDate < now;
  const isActive = !isExpired && b.status === "confirmed";

  return NextResponse.json({
    valid: true,
    _id: b._id,
    firstName: b.firstName,
    lastName: b.lastName,
    dateTime: b.dateTime,
    turnTime: b.turnTime,
    numberPersons: b.numberPersons,
    table: b.tableId,
    status: b.status,
    isExpired,
    isActive,
  });
}
