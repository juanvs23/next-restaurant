import { connectDB } from "@/database/connection";
import { Subscription } from "@/database/models/subscription";
import { subscriptionSchema } from "@/schemas/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const isValid = subscriptionSchema.safeParse({ email });

  if (!isValid.success) {
    return NextResponse.json(
      {
        status: "error",
        data: { message: "Please enter a valid email.", code: "invalid_email" },
      },
      { status: 400 },
    );
  }

  await connectDB();

  const existing = await Subscription.findOne({ email });

  if (existing) {
    return NextResponse.json(
      {
        status: "ok",
        data: {
          message:
            "<h2>Your email is already subscribed</h2><p>Thank you for your interest in our restaurant.</p>",
          code: "email_already",
        },
      },
      { status: 200 },
    );
  }

  await Subscription.create({ email });

  return NextResponse.json(
    {
      status: "ok",
      data: {
        message:
          "<h2>Thanks for subscribing</h2><p>Thank you for your interest in our restaurant.</p>",
        code: "subscribed",
      },
    },
    { status: 200 },
  );
}
