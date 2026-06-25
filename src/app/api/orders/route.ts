import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Pedido } from "@/database/models/pedido";
import { Product } from "@/database/models/product";
import { Tax } from "@/database/models/tax";
import { Charge } from "@/database/models/charge";
import { Config } from "@/database/models/config";
import { NextRequest, NextResponse } from "next/server";

import { DayClosing } from "@/database/models/day-closing";
import { getLocalDayRange } from "@/libs/timezone";
import {
  calculateCharges,
  calculateItemTaxes,
  calculateGlobalTaxes,
} from "@/libs/services/order-service";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const paymentType = searchParams.get("paymentType");
  const invoiceNumber = searchParams.get("invoiceNumber");
  const unclosedOnly = searchParams.get("unclosedOnly") === "true";

  const filter: any = {};

  if (status) filter.status = status;
  if (paymentType) filter.paymentType = paymentType;
  if (invoiceNumber) filter.invoiceNumber = parseInt(invoiceNumber);

  const config = await Config.findOne();
  const tz = config?.timezone || "-04:00";

  // unclosedOnly: exclude orders from closed days — show today + unclosed previous days
  if (unclosedOnly) {
    const closedDays = await DayClosing.find().distinct("date");
    if (closedDays.length > 0) {
      filter.$nor = closedDays.map((d: string) => {
        const { start, end } = getLocalDayRange(d, tz);
        return { createdAt: { $gte: start, $lt: end } };
      });
    }
  }

  // Timezone-aware date range
  if (dateFrom || dateTo) {
    if (dateFrom && dateTo && dateFrom === dateTo) {
      const { start, end } = getLocalDayRange(dateFrom, tz);
      filter.createdAt = { $gte: start, $lt: end };
    } else {
      filter.createdAt = {};
      if (dateFrom) {
        const { start } = getLocalDayRange(dateFrom, tz);
        filter.createdAt.$gte = start;
      }
      if (dateTo) {
        const { end } = getLocalDayRange(dateTo, tz);
        filter.createdAt.$lt = end;
      }
    }
  }

  // Text search: customer name or payment method
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { "customer.name": regex },
      { paymentMethod: regex },
    ];
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();

  let items = body.items || [];

  // Consolidate items from pedidos if provided
  if (body.pedidoIds?.length > 0) {
    const pedidos = await Pedido.find({ _id: { $in: body.pedidoIds } });
    const itemMap = new Map<string, any>();
    for (const p of pedidos) {
      for (const it of p.items) {
        const key = it.productId?.toString() || it.name;
        if (itemMap.has(key)) {
          itemMap.get(key).quantity += it.quantity;
        } else {
          itemMap.set(key, {
            productId: it.productId,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            taxBreakdown: [],
          });
        }
      }
    }
    items = Array.from(itemMap.values());
  }

  // Load references
  const [allTaxes, allCharges, config] = await Promise.all([
    Tax.find({ active: true }),
    Charge.find({ active: true }),
    Config.findOne(),
  ]);

  // ── Step 1: Subtotal ──
  let subtotal = 0;
  for (const it of items) {
    subtotal += (it.price || 0) * (it.quantity || 1);
  }

  // ── Step 2: Dynamic charges ──
  const globalCharges = allCharges.filter((c: any) => c.scope === "global");
  const {
    mergedCharges,
    totalCharge,
    serviceCharge,
    deliveryCost,
  } = await calculateCharges(
    subtotal,
    body.isDelivery,
    globalCharges,
    config,
    body.orderCharges,
    body.deliveryCost,
  );

  // ── Step 3: Taxes ──
  const productTaxes = allTaxes.filter((t: any) => t.scope === "product");
  const globalTaxes = allTaxes.filter((t: any) => t.scope === "global");

  // Build per-tax category filter
  const taxCategoryMap = new Map<string, string[]>();
  for (const tx of productTaxes) {
    const catIds = (tx.categoryIds || []).map((c: any) => c._id?.toString() || c.toString());
    taxCategoryMap.set(tx._id.toString(), catIds);
  }

  // Product lookup
  const productIds = items.map((i: any) => i.productId).filter(Boolean);
  const products: any[] = await Product.find({ _id: { $in: productIds } }).populate("taxIds");
  const productMap = new Map<string, any>(products.map((p: any) => [p._id.toString(), p]));

  // Item taxes (scope: product)
  let totalTax = await calculateItemTaxes(items, productTaxes, taxCategoryMap, productMap);

  // Global taxes (scope: global)
  const { globalTaxBreakdown, totalTax: globalTaxAdded } = await calculateGlobalTaxes(
    subtotal,
    totalCharge,
    deliveryCost,
    globalTaxes,
  );
  totalTax += globalTaxAdded;

  totalTax = Math.round(totalTax * 100) / 100;
  const total = Math.round((subtotal + totalCharge + totalTax) * 100) / 100;

  const order = await Order.create({
    ...body,
    items,
    subtotal,
    serviceCharge,
    deliveryCost,
    orderCharges: mergedCharges,
    totalCharge,
    totalTax,
    globalTaxBreakdown,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}
