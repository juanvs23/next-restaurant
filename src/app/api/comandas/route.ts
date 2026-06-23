import { connectDB } from "@/database/connection";
import { Comanda } from "@/database/models/comanda";
import { Pedido } from "@/database/models/pedido";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const comandas = await Comanda.find().sort({ createdAt: -1 });
  return NextResponse.json(comandas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const comanda = await Comanda.create(body);
  return NextResponse.json(comanda, { status: 201 });
}
