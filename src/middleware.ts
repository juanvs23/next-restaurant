import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


//export { default } from "next-auth/middleware"

export  default withAuth(
    function middleware(req) {
        console.log(req.nextauth.token)
    },
    {
      callbacks: {
        authorized: ({ token }) => token?.role === "admin",
      },
    },
)

export const config = { matcher: ["/dashboard"] }