import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/database/connection";
import { User } from "@/database/models/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email as string });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password || "",
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
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
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectDB();
        const userCount = await User.countDocuments();
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
            provider: account.provider,
            image: user.image,
            role: userCount === 0 ? "admin" : "staff",
          });
        } else {
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

        // Set role at sign-in (avoids DB call on every middleware request)
        if (token.email) {
          try {
            await connectDB();
            const user = await User.findOne({ email: token.email });
            token.role = user?.role ?? "user";
            token.userId = user?._id?.toString();
          } catch {
            token.role = "user";
          }
        }
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
