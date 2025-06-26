import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userMail: { label: "Email", type: "text" },
        userPassword: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMail: credentials?.userMail,
            userPassword: credentials?.userPassword,
          }),
        });

        const data = await res.json();

        if (res.ok && data.token) {
          return {
            id: data.user?.userId || "default-id",
            email: credentials?.userMail,
            token: data.token.token, // token dentro de "token.token"
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

