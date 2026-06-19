import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const users = await User.find().sort({ name: 1 });
  return NextResponse.json(users);
}
