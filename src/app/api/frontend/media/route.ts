import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const filter: any = {};
  if (category) filter.category = category;

  const media = await Media.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .lean();

  return NextResponse.json(media);
}
