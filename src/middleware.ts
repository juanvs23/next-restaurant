import { auth } from "./app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth?.accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
