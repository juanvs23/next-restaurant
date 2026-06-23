import { connectDB } from "@/database/connection";
import { Config } from "@/database/models/config";
import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  let config = await Config.findOne();
  if (!config) {
    config = await Config.create({});
  }
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Only admins can modify config" }, { status: 403 });
  }

  const body = await req.json();
  await connectDB();
  const config = await Config.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json(config);
}
