// import NextAuth, { AuthOptions } from "next-auth";
// import connectToMongoDB from "@/lib/db";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";

// const authOptions: AuthOptions = {
//   callbacks: {
//     async jwt({ token, user}) {
//       if (user) token.user = user;
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = token.user as any;
//       return session;
//     },
//   },
//   providers: [
//     // GitHub Provider
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,

//       async profile(profile) {
//         connectToMongoDB();

//         const email = profile.email;
//         const username = profile.name;
//         const avatar = profile.avatar_url;

//         const exist_user = await User.findOne({ email: email })

//         if (!exist_user) User.create({ email, username, avatar });

//         return {
//           id: profile.id,
//           username,
//           email,
//           avatar,
//         };
//       }
//     }),

//     // Google Provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,

//       async profile(profile) {
//         await connectToMongoDB();

//         const email = profile.email;
//         const username = profile.name;
//         const avatar = profile.picture;

//         const exist_user = await User.findOne({ email });

//         if (!exist_user) User.create({ email, username, avatar });

//         return {
//           id: profile.sub,
//           username,
//           email,
//           avatar,
//         };
//       },
//     }),

//     // Credentials authentication providers...
//     Credentials({
//       credentials: {
//         email: { label: "email", type: "text", placeholder: "" },
//         password: { label: "password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         if (!credentials) {
//           throw new Error("Invalid credentials.");
//         }

//         const email = credentials.email as string;
//         const password = credentials.password as string;

//         if (!email || !password) {
//           throw new Error("Invalid credentials.");
//         }

//         await connectToMongoDB();
//         // logic to verify if user exists
//         const user = await User.findOne({ email: email });

//         if (!user) {
//           // No user found, so this is their first attempt to login
//           // meaning this is also the place you could do registration
//           throw new Error("User not found.");
//         }

//         const isMatch = await bcrypt.compare(password, user?.password!);
//         if (!isMatch) {
//           // Passwords don't match
//           throw new Error("Password does not match.");
//         }
//         // return user object with the their profile data
//         return {
//           id: user._id.toString(),
//           name: user.username,
//           email: user.email,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET
// };
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import { authOptions } from '@/utils/authOptions'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };