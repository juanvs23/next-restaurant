import { connectDB } from "@/database/connection";
import { MediaCategory } from "@/database/models/media-category";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const existing = await MediaCategory.findOne({ slug, _id: { $ne: id } });
  if (existing) {
    return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 });
  }

  const cat = await MediaCategory.findByIdAndUpdate(id, { name, slug }, { new: true });
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await MediaCategory.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
