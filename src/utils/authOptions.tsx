import { NextAuthOptions } from "next-auth";
import connectToMongoDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 1 hour in seconds
  },
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.user = {
          _id: user.id, // Use the `id` field from the returned user data
          username: user.name, // Also adding username to the token
          email: user.email, // Adding email to the token
        };
       
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  providers: [
    // GitHub Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,

      async profile(profile) {
        connectToMongoDB();

        const email = profile.email;
        const username = profile.name;
        const avatar = profile.avatar_url;
        const password = profile.id;

        const exist_user = await User.findOne({ email: email })

        if (!exist_user) {
          const newUser = User.create({ email, username, avatar });
          return newUser;
        }
          
        return exist_user;
      }
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,

      async profile(profile) {
        await connectToMongoDB();

        const email = profile.email;
        const username = profile.name;
        const avatar = profile.picture;
        const password = profile.id;

        const exist_user = await User.findOne({ email });

        if (!exist_user) {
          const newUser = User.create({ email, username, avatar });
          return newUser;
        }

        return exist_user;
      },
    }),

    // Credentials authentication providers...
    Credentials({
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Invalid credentials.");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        console.log(email, password)

        if (!email || !password) {
          throw new Error("Invalid credentials.");
        }

        await connectToMongoDB();
        // logic to verify if user exists
        const user = await User.findOne({ email: email });

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user?.password!);
        if (!isMatch) {
          // Passwords don't match
          throw new Error("Password does not match.");
        }
        // return user object with the their profile data
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

