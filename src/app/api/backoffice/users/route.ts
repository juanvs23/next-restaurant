import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import { requireRole } from "@/libs/auth/require-role";
import { createUserSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const error = await requireRole("admin");
  if (error) return error;
  await connectDB();
  const users = await User.find().sort({ name: 1 });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();

  // Check if email already exists
  const existing = await User.findOne({ email: body.email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 },
    );
  }

  const user = await User.create({
    ...parsed.data,
    role: "user",
    provider: "credentials",
  });

  // Never return password
  const { password, ...safe } = user.toObject();
  return NextResponse.json(safe, { status: 201 });
}
