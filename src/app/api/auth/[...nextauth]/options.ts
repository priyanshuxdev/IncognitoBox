import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { User } from "next-auth";

//In credentials provider in next auth have user with limited fields so if we have more custom fields to add in user we have to add tne type of user in next auth in next-auth.d.ts file

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email/Username",
          type: "text",
          placeholder: "Email/Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          throw new Error("Credentials are required");
        }
        //connect to database
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials?.identifier },
              { email: credentials?.identifier },
            ],
          });
          // console.log(user);

          if (!user) {
            return null;
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email first!");
          }

          if (!credentials?.password) {
            throw new Error("Password is required!");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user?.password as string
          );

          if (!isValid) {
            throw new Error("Incorrect password!");
          } else {
            return {
              id: (user._id as string).toString(),
              _id: (user._id as string).toString(),
              username: user.username as string,
              // password: user?.password as string,
              isVerified: user.isVerified as boolean,
              isAcceptingMessages: user.isAcceptingMessages as boolean,
            };
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unknown error occurred!");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        try {
          const existingUser = await UserModel.findOne({ email: user.email });

          if (existingUser) {
            // Update existing user's Google info
            existingUser.googleId = account.providerAccountId;
            existingUser.isVerified = true;
            await existingUser.save();

            // Add user data to the token
            user._id = (existingUser._id as string).toString();
            user.username = existingUser.username;
            user.isVerified = existingUser.isVerified;
            user.isAcceptingMessages = existingUser.isAcceptingMessages;
            return true;
          }

          // Create new user if doesn't exist
          const newUser = new UserModel({
            email: user.email,
            username: user.name?.split(" ")[0],
            googleId: account.providerAccountId,
            isVerified: true, //pre-verified
            isAcceptingMessages: true,
            messages: [],
          });

          await newUser.save();

          // Add user data to the token
          user._id = (newUser._id as string).toString();
          user.username = newUser.username;
          user.isVerified = newUser.isVerified;
          user.isAcceptingMessages = newUser.isAcceptingMessages;
          return true;
        } catch (error) {
          console.error("Error in Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
