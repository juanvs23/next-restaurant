import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();

  // If password is being set, hash it (findByIdAndUpdate bypasses pre-save hooks)
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 12);
  }

  const updated = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Never return password
  const { password, ...safe } = updated.toObject();
  return NextResponse.json(safe);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const updated = await User.findByIdAndUpdate(id, { active: false }, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, active: false });
}
