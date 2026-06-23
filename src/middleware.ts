import { auth } from "./app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Dashboard requires authentication
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth?.accessToken) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      const response = NextResponse.redirect(signInUrl);
      // Set the callback URL cookie that Auth.js reads
      response.cookies.set("authjs.callback-url", req.url, {
        path: "/",
        httpOnly: false,
      });
      return response;
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
