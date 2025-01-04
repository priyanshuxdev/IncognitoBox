import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //connecting to database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const existingUser = await UserModel.findOne({ username: decodedUsername });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //checkin if the code is correct and not expired
    const isCodeValid = existingUser.verifyToken === code;
    const isCodeNotExpired =
      new Date(existingUser.verifyTokenExpires) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      //updating the user as verified
      existingUser.isVerified = true;
      await existingUser.save();
      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      //if the code is expired
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification code has expired, please sign up again to get a new one!",
        },
        {
          status: 400,
        }
      );
    } else {
      //if the code is invalid
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error in verify-code route: ", error);
    return NextResponse.json(
      { success: false, error: "Error in verifying user" },
      { status: 500 }
    );
  }
}
