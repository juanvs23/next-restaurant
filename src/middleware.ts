import { auth } from "./app/auth";
import { NextResponse } from "next/server";

const adminOnly = [
  "/dashboard/users",
  "/dashboard/products",
  "/dashboard/categories",
  "/dashboard/tables",
  "/dashboard/turns",
  "/dashboard/config",
  "/dashboard/media",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.role;
  const isAuth = !!(req.auth?.accessToken || req.auth?.userId);

  // All dashboard routes require authentication
  if (!pathname.startsWith("/dashboard")) return;

  if (!isAuth) return redirectToLogin(req);

  // Admin-only routes
  if (adminOnly.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

function redirectToLogin(req: any) {
  const signInUrl = new URL("/login", req.url);
  signInUrl.searchParams.set("callbackUrl", req.url);
  const response = NextResponse.redirect(signInUrl);
  response.cookies.set("authjs.callback-url", req.url, {
    path: "/",
    httpOnly: false,
  });
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
