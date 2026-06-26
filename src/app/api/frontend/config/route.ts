import { connectDB } from "@/database/connection";
import { Config } from "@/database/models/config";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const config = await Config.findOne();
  if (!config) {
    return NextResponse.json({ timezone: "-04:00", businessName: "GERÍCHT" });
  }
  return NextResponse.json({
    timezone: config.timezone,
    businessName: config.businessName,
    defaultLanguage: config.defaultLanguage,
    exchangeRateBcv: config.exchangeRateBcv ?? 0,
    exchangeRateUsdt: config.exchangeRateUsdt ?? 0,
  });
}
