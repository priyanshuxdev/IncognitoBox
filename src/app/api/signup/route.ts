import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    //generate random token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User with this email already exists",
          },
          { status: 400 }
        );
      } else {
        //update existing user
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = verifyToken;
        existingUserByEmail.verifyTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await existingUserByEmail.save();
      }
    } else {
      //hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      //token expiry date
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

      //create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpires: expiryDate,
        isVerified: false,
        isAccepting: true,
        messages: [],
      });

      //save user
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyToken
    );
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully, please verify your account",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occur while registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
