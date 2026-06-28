import { connectDB } from "@/database/connection";
import { Category } from "@/database/models/category";
import { createCategorySchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const categories = await Category.find().populate("items").sort({ name: 1 });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const category = await Category.create(parsed.data);
  return NextResponse.json(category, { status: 201 });
}
