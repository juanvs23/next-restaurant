import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";

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
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectDB();
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
            image: user.image,
            role: "user",
          });
        } else {
          // Update profile on each sign in
          existing.name = user.name ?? existing.name;
          existing.image = user.image ?? existing.image;
          existing.googleId = account.providerAccountId;
          await existing.save();
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : undefined;
      }

      // Attach role on first JWT creation or periodically
      if (token.email) {
        await connectDB();
        const user = await User.findOne({ email: token.email });
        token.role = user?.role ?? "user";
        token.userId = user?._id?.toString();
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
          delete token.accessToken;
          delete token.expiresAt;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.role = token.role as string | undefined;
      (session as any).userId = token.userId;
      return session;
    },
  },
});
