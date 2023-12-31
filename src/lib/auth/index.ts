import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";

import  {initializeDb} from "@/db";
import { usersTable } from "@/db/schema";

import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, 
    GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
   }), 
   CredentialsProvider],
  callbacks: {

    async session({ session, token }) {
      const email = token.email || session?.user?.email;
      if (!email) return session;
      const db = await initializeDb();
      const [user] = await db 
        .select({
          id: usersTable.displayId,
          provider: usersTable.provider,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          provider: user.provider,
        },
      };
    },
    async jwt({ token, account }) {
      // Sign in with social account, e.g. GitHub, Google, etc.
      if (!account) return token;
      const { name, email } = token;
      const provider = account.provider;
      if (!name || !email || !provider) return token;
      const db = await initializeDb();
      // Check if the email has been registered
      const [existedUser] = await db
        .select({
          id: usersTable.displayId,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();
      if (existedUser) return token;
      if (provider !== "github" && provider !== "google") return token;

      // Sign up
      await db.insert(usersTable).values({
        name: name,
        email: email.toLowerCase(),
        provider,
      });

      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});
