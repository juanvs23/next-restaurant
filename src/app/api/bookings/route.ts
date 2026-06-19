import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const bookings = await Booking.find().populate("tableId").sort({ dateTime: -1 });
  return NextResponse.json(bookings);
}
