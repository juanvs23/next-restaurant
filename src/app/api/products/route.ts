import { connectDB } from "@/database/connection";
import { Product } from "@/database/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("categoryId").sort({ name: 1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
