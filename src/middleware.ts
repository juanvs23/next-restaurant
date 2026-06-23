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

const staffAndUp = [
  "/dashboard",
  "/dashboard/comanda",
  "/dashboard/bookings",
  "/dashboard/orders",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.role;
  const isAuth = !!req.auth?.accessToken;

  // Block non-authenticated users from all dashboard routes
  if (staffAndUp.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!isAuth) {
      return redirectToLogin(req);
    }
  }

  // Admin-only routes
  if (adminOnly.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!isAuth) return redirectToLogin(req);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Allow staff to access orders/comanda/bookings
  if (
    (pathname.startsWith("/dashboard/orders") ||
     pathname.startsWith("/dashboard/comanda") ||
     pathname.startsWith("/dashboard/bookings")) &&
    !isAuth
  ) {
    return redirectToLogin(req);
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
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
  ],
};
