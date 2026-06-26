import { auth } from "./app/auth";
import { NextResponse } from "next/server";

const adminOnly = [
  "/dashboard/users",
  "/dashboard/tables",
  "/dashboard/turns",
  "/dashboard/config",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.role;
  const isAuth = !!(req.auth?.accessToken || req.auth?.userId);

  // ── Backoffice API Routes (protected) ──
  if (pathname.startsWith("/api/backoffice")) {
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return;
  }

  // ── Dashboard Routes (protected) ──
  if (!pathname.startsWith("/dashboard")) return;

  if (!isAuth) return redirectToLogin(req);

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
    httpOnly: true,
  });
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/api/:path*", "/api"],
};
