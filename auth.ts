import NextAuth, { type NextAuthConfig, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface ExtendedUser extends User {
  role: Role;
}

const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60,   // Refresh session every 24 hours
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials): Promise<ExtendedUser | null> => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        
        // User doesn't exist
        if (!user?.passwordHash) {
          throw new Error("USER_NOT_FOUND");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        
        // Wrong password
        if (!isValid) {
          throw new Error("INVALID_PASSWORD");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as Role) ?? ROLES.READER;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
