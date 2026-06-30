import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { Config } from "@/database/models/config";
import { getStorageProvider } from "@/libs/services/storage-service";
import { createMediaSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const media = await Media.find().sort({ createdAt: -1 });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const config = await Config.findOne();

    const provider = getStorageProvider(config || {});
    const { url, size } = await provider.upload(
      buffer,
      file.name,
      file.type,
    );

    const media = await Media.create({
      filename: file.name,
      url,
      mimeType: file.type,
      size,
      alt: (formData.get("alt") as string) || "",
      title: (formData.get("title") as string) || "",
      caption: (formData.get("caption") as string) || "",
      description: (formData.get("description") as string) || "",
      category: (formData.get("category") as string) || "",
    });

    return NextResponse.json(media, { status: 201 });
  }

  const body = await req.json();
  const parsed = createMediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const media = await Media.create(parsed.data);
  return NextResponse.json(media, { status: 201 });
}
