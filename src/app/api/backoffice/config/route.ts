import { connectDB } from "@/database/connection";
import { Config } from "@/database/models/config";
import { requireRole } from "@/libs/auth/require-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const error = await requireRole("admin");
  if (error) return error;
  await connectDB();
  const config = await Config.findOne() ?? await Config.create({});
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const error = await requireRole("admin");
  if (error) return error;

  const body = await req.json();
  await connectDB();
  const config = await Config.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json(config);
}
