import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },

  providers: [
    /** --------------------
     *  🔵 LOGIN WITH EMAIL + PASSWORD
     *  -------------------- */
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const response = await fetch(`${process.env.API}/auth/signin`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const payload = await response.json();

        if (payload.message === "success") {
          const decodedToken: { id: string } = jwtDecode(payload.token);

          return {
            id: decodedToken.id,
            user: payload.user,
            token: payload.token,
          };
        }

        throw new Error(payload.message || "wrong credentials");
      },
    }),

    /** --------------------
     *  🔴 GOOGLE LOGIN
     *  -------------------- */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /** --------------------
     * 🔵 LINKEDIN LOGIN
     *  -------------------- */
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user ?? user; // Google/Li return user directly
        token.token = user.token ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.token = token.token ?? null;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};
