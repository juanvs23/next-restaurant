import { connectDB } from "@/database/connection";
import { Comanda } from "@/database/models/comanda";
import { Order } from "@/database/models/order";
import { createComandaSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");

  // Auto-close comandas from previous days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Comanda.updateMany(
    { status: "open", createdAt: { $lt: today } },
    { status: "closed" },
  );

  // Auto-close open comandas that have been paid (safety check)
  const paidOrders = await Order.find({ status: "paid", comandaId: { $ne: null } });
  const paidComandaIds = [...new Set(paidOrders.map((o: any) => o.comandaId?.toString()).filter(Boolean))];
  if (paidComandaIds.length > 0) {
    await Comanda.updateMany(
      { _id: { $in: paidComandaIds }, status: "open" },
      { status: "closed" },
    );
  }

  const startDate = dateParam
    ? new Date(`${dateParam}T00:00:00`)
    : today;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const comandas = await Comanda.find({
    createdAt: { $gte: startDate, $lt: endDate },
  }).sort({ createdAt: -1 });

  return NextResponse.json(comandas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createComandaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const comanda = await Comanda.create(parsed.data);
  return NextResponse.json(comanda, { status: 201 });
}
