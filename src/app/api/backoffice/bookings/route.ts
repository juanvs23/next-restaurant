import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { TableModel } from "@/database/models/table";
import { createBookingSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  // Auto-cancel bookings that are >20 min past their time
  const now = new Date();
  const twentyMinAgo = new Date(now.getTime() - 20 * 60 * 1000);
  await Booking.updateMany(
    { dateTime: { $lte: twentyMinAgo }, status: { $in: ["pending", "confirmed"] } },
    { status: "cancelled" },
  );

  const bookings = await Booking.find()
    .populate("tableId")
    .sort({ dateTime: -1 });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as any;
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const { firstName, lastName, email, dateTime, turnTime, numberPersons } =
    parsed.data;

  // Find an available table
  const datePart = dateTime.substring(0, 10);
  const startOfDay = new Date(`${datePart}T00:00:00`);
  const endOfDay = new Date(`${datePart}T23:59:59.999`);

  const candidateTables = await TableModel.find({
    capacity: { $gte: numberPersons },
    status: { $ne: "maintenance" },
  });

  const existingBookings = await Booking.find({
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    turnTime,
    status: { $in: ["pending", "confirmed"] },
  });

  const bookedTableIds = existingBookings
    .filter((b: any) => b.tableId)
    .map((b: any) => b.tableId?.toString());

  const availableTable = candidateTables.find(
    (t: any) => !bookedTableIds.includes(t._id.toString())
  );

  const booking = await Booking.create({
    ...parsed.data,
    tableId: availableTable?._id,
    status: "confirmed",
  });

  return NextResponse.json(
    {
      ...booking.toObject(),
      table: availableTable ?? null,
    },
    { status: 201 }
  );
}
