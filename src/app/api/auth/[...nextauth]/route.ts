import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      // ⚠️ SECURITY FIX: Use server-only environment variable (without NEXT_PUBLIC_)
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ⚠️ SECURITY FIX: Use server-only environment variable (without NEXT_PUBLIC_)
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
