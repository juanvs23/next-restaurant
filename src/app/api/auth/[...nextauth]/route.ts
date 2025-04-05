import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";


export const authConfig = {
  providers:[
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
      })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }:{ token: any, account: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }:{ session: any, token: any }) {
      session.user.accessToken = token.accessToken
      return session
    }
  }
} 

const handler = NextAuth(authConfig)
  
  export { handler as GET, handler as POST }