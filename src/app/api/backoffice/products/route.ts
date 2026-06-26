import { connectDB } from "@/database/connection";
import { Product } from "@/database/models/product";
import { createProductSchema } from "@/schemas/backoffice";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("categoryId").sort({ name: 1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  await connectDB();
  const product = await Product.create(parsed.data);
  return NextResponse.json(product, { status: 201 });
}
