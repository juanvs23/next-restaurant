import { connectDB } from "@/database/connection";
import { Media } from "@/database/models/media";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const media = await Media.find().sort({ createdAt: -1 });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const media = await Media.create(body);
  return NextResponse.json(media, { status: 201 });
}
