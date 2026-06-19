import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const categories = await Category.find().populate("items").sort({ name: 1 });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const category = await Category.create(body);
  return NextResponse.json(category, { status: 201 });
}
