import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const users = await User.find().sort({ name: 1 });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const user = await User.create(body);
  return NextResponse.json(user, { status: 201 });
}
