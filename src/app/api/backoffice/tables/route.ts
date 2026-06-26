import { connectDB } from "@/database/connection";
import { TableModel } from "@/database/models/table";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const tables = await TableModel.find().sort({ tableId: 1 });
  return NextResponse.json(tables);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const table = await TableModel.create(body);
  return NextResponse.json(table, { status: 201 });
}
