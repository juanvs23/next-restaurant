import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { MediaCategory } from "@/database/models/media-category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const filter: any = {};
  if (category) {
    const cat = await MediaCategory.findOne({ slug: category }).lean();
    if (cat) {
      filter.categories = cat._id;
    } else {
      // Slug not found → return empty
      return NextResponse.json([]);
    }
  }

  const media = await Media.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .lean();

  return NextResponse.json(media);
}
