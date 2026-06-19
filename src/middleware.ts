import { auth } from "./app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Dashboard requires authentication
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth?.accessToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Admin-only routes (future: product/category/user management)
  if (pathname.startsWith("/dashboard/users") && req.auth?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
