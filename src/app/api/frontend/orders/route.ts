import { connectDB } from "@/database/connection";
import { Order } from "@/database/models/order";
import { Config } from "@/database/models/config";
import { checkoutSchema } from "@/schemas/frontend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const config = await Config.findOne().lean();
    const exchangeRateBcv = config?.exchangeRateBcv ?? 0;

    if (!exchangeRateBcv || exchangeRateBcv <= 0) {
      return NextResponse.json(
        { error: "Exchange rate not configured. Orders are temporarily unavailable." },
        { status: 503 }
      );
    }

    // Map items to order format and calculate totals
    const items = parsed.data.items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      taxRate: 0,
      taxBreakdown: [],
    }));

    const totalUsd = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const totalUsdRef = Math.round(totalUsd * 100) / 100;

    // Total in VES using frozen exchange rate (rate already validated > 0 above)
    const totalVes = Math.round(totalUsdRef * exchangeRateBcv * 100) / 100;

    const order = await Order.create({
      items,
      customer: {
        name: parsed.data.customer.name,
        email: parsed.data.customer.email ?? "",
        phone: parsed.data.customer.phone,
      },
      notes: parsed.data.notes ?? "",
      source: "frontend",
      status: "pending",
      total: totalVes,
      totalUsdRef,
      exchangeRateBcv,
      subtotal: totalVes,
      totalTax: 0,
      totalCharge: 0,
    });

    return NextResponse.json(
      {
        _id: order._id.toString(),
        status: order.status,
        total: order.total,
        totalUsdRef: order.totalUsdRef,
        exchangeRateBcv: order.exchangeRateBcv,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/frontend/orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
