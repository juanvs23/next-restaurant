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
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  await connectDB();

  const media = await Media.findById(id);
  if (!media)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = parsed.data;
  if (data.filename !== undefined) media.filename = data.filename;
  if (data.url !== undefined) media.url = data.url;
  if (data.mimeType !== undefined) media.mimeType = data.mimeType;
  if (data.size !== undefined) media.size = data.size;
  if (data.alt !== undefined) media.alt = data.alt;
  if (data.title !== undefined) media.title = data.title;
  if (data.categories !== undefined) {
    const objectIds = (data.categories as string[]).map(
      (id) => id // Strings are valid — Mongoose cast handles ObjectId conversion
    );
    (media as any).categories = objectIds;
    media.markModified("categories");
  }

  const updated = await media.save();

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
