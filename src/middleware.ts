import { auth } from "./app/auth";
import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ── Auth middleware (dashboard + API) ──

const adminOnly = [
  "/dashboard/users",
  "/dashboard/tables",
  "/dashboard/turns",
  "/dashboard/config",
];

const authMiddleware = auth((req) => {
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

// ── i18n middleware (frontend routes only) ──

const intlMiddleware = createMiddleware(routing);

// ── Composed middleware ──

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth routes: dashboard + API
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/backoffice") ||
    pathname.startsWith("/login")
  ) {
    return authMiddleware(req as any, {} as any);
  }

  // Frontend routes: i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Dashboard + API + Login (auth)
    "/dashboard/:path*",
    "/dashboard",
    "/api/backoffice/:path*",
    "/login",
    // Frontend (i18n)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
