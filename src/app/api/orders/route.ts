import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Pedido } from "@/database/models/pedido";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();

  // If comandaId and pedidoIds are provided, consolidate items from pedidos
  let items = body.items || [];
  let subtotal = 0;

  if (body.pedidoIds?.length > 0) {
    const pedidos = await Pedido.find({ _id: { $in: body.pedidoIds } });
    const itemMap = new Map<string, any>();
    for (const p of pedidos) {
      for (const it of p.items) {
        const key = it.productId?.toString() || it.name;
        if (itemMap.has(key)) {
          itemMap.get(key).quantity += it.quantity;
        } else {
          itemMap.set(key, { productId: it.productId, name: it.name, price: it.price, quantity: it.quantity });
        }
      }
    }
    items = Array.from(itemMap.values());
  }

  for (const it of items) {
    subtotal += (it.price || 0) * (it.quantity || 1);
  }

  const serviceCharge = body.serviceCharge ?? (body.tableLabel ? Math.round(subtotal * 0.1 * 100) / 100 : 0);
  const deliveryCost = body.deliveryCost ?? 0;
  const total = subtotal + serviceCharge + deliveryCost;

  const order = await Order.create({
    ...body,
    items,
    subtotal,
    serviceCharge,
    deliveryCost,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}
