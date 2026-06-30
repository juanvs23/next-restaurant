import { connectDB } from "@/database/connection";
import { MediaCategory } from "@/database/models/media-category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const cats = await MediaCategory.find().sort({ name: 1 }).lean();
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const name = (body.name || "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const existing = await MediaCategory.findOne({ slug });
  if (existing) {
    return NextResponse.json(existing);
  }

  const cat = await MediaCategory.create({ name, slug });
  return NextResponse.json(cat, { status: 201 });
}
