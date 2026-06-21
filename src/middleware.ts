import { auth } from "./app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Dashboard requires authentication
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth?.accessToken) {
      return NextResponse.redirect(
        new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(req.url)}`, req.url)
      );
    }
  }

  // Admin-only routes
  if (
    (pathname.startsWith("/dashboard/users") ||
     pathname.startsWith("/dashboard/products") ||
     pathname.startsWith("/dashboard/categories")) &&
    req.auth?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
