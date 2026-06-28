import { connectDB } from "@/database/connection";
import { Pedido } from "@/database/models/pedido";
import { createPedidoSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const comandaId = searchParams.get("comandaId");
  await connectDB();

  const filter: any = {};
  if (comandaId) filter.comandaId = comandaId;

  const pedidos = await Pedido.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(pedidos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createPedidoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const pedido = await Pedido.create(parsed.data);
  return NextResponse.json(pedido, { status: 201 });
}
