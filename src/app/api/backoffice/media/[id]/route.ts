import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { Config } from "@/database/models/config";
import { getStorageProvider } from "@/libs/services/storage-service";
import { updateMediaSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateMediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const updated = await Media.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();

  const media = await Media.findById(id);
  if (!media)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const config = await Config.findOne();
    const provider = getStorageProvider(config || {});
    await provider.delete(media.url);
  } catch {
    // Storage delete failure is non-blocking — keep DB record
  }

  await Media.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
