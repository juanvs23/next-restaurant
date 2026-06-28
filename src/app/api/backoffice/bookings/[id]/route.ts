import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { updateBookingSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const updated = await Booking.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateBookingSchema.pick({ status: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const booking = await Booking.findById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const bookingDate = new Date(booking.dateTime);

  // Rule: Reschedule requires 30 min advance notice
  if (parsed.data.status === "rescheduled") {
    const diffMs = bookingDate.getTime() - now.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 30) {
      return NextResponse.json(
        { error: "Rescheduling requires at least 30 minutes advance notice" },
        { status: 400 },
      );
    }
  }

  // Apply status change
  booking.status = parsed.data.status;
  await booking.save();

  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const deleted = await Booking.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
