import { connectDB } from "@/database/connection";
import { Config } from "@/database/models/config";
import { requireRole } from "@/libs/auth/require-role";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const config = await Config.findOne();
  return NextResponse.json({
    exchangeRateBcv: config?.exchangeRateBcv || 0,
    exchangeRateUsdt: config?.exchangeRateUsdt || 0,
    lastRateUpdate: config?.lastRateUpdate || null,
  });
}

export async function POST() {
  const error = await requireRole("admin");
  if (error) return error;

  await connectDB();
  let bcvRate = 0;
  let usdtRate = 0;

  try {
    const res = await fetch("https://ve.dolarapi.com/v1/tasas/dolares", {
      signal: AbortSignal.timeout(5000),
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

  if (bcvRate > 0 || usdtRate > 0) {
    await Config.findOneAndUpdate(
      {},
      {
        $set: {
          ...(bcvRate > 0 && { exchangeRateBcv: bcvRate }),
          ...(usdtRate > 0 && { exchangeRateUsdt: usdtRate }),
          lastRateUpdate: new Date(),
        },
      },
      { upsert: true },
    );
  }

  const config = await Config.findOne();
  return NextResponse.json({
    exchangeRateBcv: config?.exchangeRateBcv || 0,
    exchangeRateUsdt: config?.exchangeRateUsdt || 0,
    lastRateUpdate: config?.lastRateUpdate || null,
  });
}
