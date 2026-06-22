import { connectDB } from "@/database/connection";
import { TableModel } from "@/database/models/table";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const updated = await TableModel.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const deleted = await TableModel.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
