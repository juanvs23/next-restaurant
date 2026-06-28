import { connectDB } from "@/database/connection";
import { TableModel } from "@/database/models/table";
import { createTableSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const tables = await TableModel.find().sort({ tableId: 1 });
  return NextResponse.json(tables);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createTableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const table = await TableModel.create(parsed.data);
  return NextResponse.json(table, { status: 201 });
}
