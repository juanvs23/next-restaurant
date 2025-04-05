import { connectDB, closeDB } from "@/database/connection";
import { Suscription } from "@/database/models/suscription";
import { suscriptionSchema } from "@/schemas/suscription";
import { NextResponse } from "next/server";
const handler = async (req: Request, resp: NextResponse) => {
  const { email } = await req.json();
  const isEMail = suscriptionSchema.safeParse({ email });
  if (!isEMail.success)
    return NextResponse.json(
      {
        status: "error",
        data: { message: "Please enter a valid email.", code: "invalid_email" },
      },
      { status: 400 },
    );
  await connectDB();
  const checkEmail = await Suscription.findOne({ email });

  if (checkEmail)
    return NextResponse.json(
      {
        status: "ok",
        data: {
          message:
            "<h2>Your email is already suscribed</h2><p>Thank you for your interest in our restaurant.</p>",
          code: "email_already",
        },
      },
      { status: 200 },
    );
  const suscription = new Suscription({ email });
  await suscription.save();

  closeDB();
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
};
export { handler as POST };
