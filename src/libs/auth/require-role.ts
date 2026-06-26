import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

type Role = "admin" | "staff" | "user";

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (roles.length > 0 && !roles.includes(session.role as Role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
