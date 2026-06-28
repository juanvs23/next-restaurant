import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import { registerUserSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  const existing = await User.findOne({ email: body.email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const user = await User.create({
    ...parsed.data,
    role: "user",
    provider: "credentials",
  });

  const { password, ...safe } = user.toObject();
  return NextResponse.json(safe, { status: 201 });
}
