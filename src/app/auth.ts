import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : undefined;
      }

      // Return previous token if not expired
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Token expired — try to refresh
      if (token.refreshToken) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              refresh_token: token.refreshToken as string,
              grant_type: "refresh_token",
            }),
          });

          const tokens = await response.json();
          if (!response.ok) throw tokens;

          token.accessToken = tokens.access_token;
          token.expiresAt = Date.now() + tokens.expires_in * 1000;
        } catch {
          // Refresh failed — token will be invalid, user needs to sign in again
          delete token.accessToken;
          delete token.expiresAt;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});
