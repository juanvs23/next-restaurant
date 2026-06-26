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
  let bcvRate = body.exchangeRateBcv || 0;
  let usdtRate = body.exchangeRateUsdt || 0;

  // If no manual rates provided, try fetching from external API
  if (!body.exchangeRateBcv && !body.exchangeRateUsdt) {
    try {
      const res = await fetch("https://ve.dolarapi.com/v1/tasas/dolares", {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data: any[] = await res.json();
        const bcv = data.find((d: any) => d._id === "bcv");
        const paralelo = data.find((d: any) => d._id === "paralelo");
        bcvRate = bcv?.promedio || 0;
        usdtRate = paralelo?.promedio || 0;
      }
    } catch {
      // API unreachable — keep existing rates
    }
  }

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
