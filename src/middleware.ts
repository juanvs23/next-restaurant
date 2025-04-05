import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    // Acceso al token (incluyendo tu accessToken personalizado)
    console.log("Token completo:", req.nextauth.token);
    console.log("AccessToken:", req.nextauth.token?.accessToken);

    // Ejemplo: Redirigir si no hay token
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Puedes agregar más lógica de autorización aquí
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Verifica tanto el token como tu accessToken personalizado
        return !!token?.accessToken;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
