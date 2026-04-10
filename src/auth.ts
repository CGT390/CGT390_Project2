import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {
  auth,
  handlers,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log("No user found for:", email);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            console.log("Invalid password for:", email);
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    GitHub({
      issuer: "https://github.com/login/oauth",
    }),
    Google,
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const isProtectedRoute =
        path.startsWith("/add-profile") ||
        (path.startsWith("/profile/") && path.endsWith("/edit"));

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
  },
});