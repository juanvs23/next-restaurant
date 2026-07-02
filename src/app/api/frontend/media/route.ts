import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { MediaCategory } from "@/database/models/media-category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const categorySlugs = searchParams.getAll("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const filter: any = {};
  if (categorySlugs.length > 0) {
    const cats = await MediaCategory.find({ slug: { $in: categorySlugs } }).lean();
    if (cats.length === 0) {
      return NextResponse.json([]);
    }
    filter.categories = { $in: cats.map((c: any) => c._id) };
  }

  const media = await Media.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .lean();

  return NextResponse.json(media);
}
