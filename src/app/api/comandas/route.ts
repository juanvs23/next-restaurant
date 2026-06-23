import { connectDB } from "@/database/connection";
import { Comanda } from "@/database/models/comanda";
import { Pedido } from "@/database/models/pedido";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  // Auto-close comandas from previous days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Comanda.updateMany(
    { status: "open", createdAt: { $lt: today } },
    { status: "closed" },
  );

  // Return today's comandas (both open and closed for reference)
  const comandas = await Comanda.find({
    createdAt: { $gte: today },
  }).sort({ createdAt: -1 });

  return NextResponse.json(comandas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const comanda = await Comanda.create(body);
  return NextResponse.json(comanda, { status: 201 });
}
