import { connectDB } from "@/database/connection";
import { Config } from "@/database/models/config";
import { requireRole } from "@/libs/auth/require-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const config = await Config.findOne();
  return NextResponse.json({
    exchangeRateBcv: config?.exchangeRateBcv || 0,
    exchangeRateUsdt: config?.exchangeRateUsdt || 0,
    lastRateUpdate: config?.lastRateUpdate || null,
  });
}

export async function POST(req: NextRequest) {
  const error = await requireRole("admin");
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  await connectDB();
  const bcvRate = body.exchangeRateBcv || 0;
  const usdtRate = body.exchangeRateUsdt || 0;

  if (bcvRate > 0 || usdtRate > 0) {
    const update: any = { lastRateUpdate: new Date() };
    if (bcvRate > 0) update.exchangeRateBcv = bcvRate;
    if (usdtRate > 0) update.exchangeRateUsdt = usdtRate;
    await Config.findOneAndUpdate({}, { $set: update }, { upsert: true });
  }

  const config = await Config.findOne();
  return NextResponse.json({
    exchangeRateBcv: config?.exchangeRateBcv || 0,
    exchangeRateUsdt: config?.exchangeRateUsdt || 0,
    lastRateUpdate: config?.lastRateUpdate || null,
  });
}
