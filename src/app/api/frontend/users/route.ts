import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();

  const existing = await User.findOne({ email: body.email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    role: "user",
    provider: "credentials",
  });

  const { password, ...safe } = user.toObject();
  return NextResponse.json(safe, { status: 201 });
}
