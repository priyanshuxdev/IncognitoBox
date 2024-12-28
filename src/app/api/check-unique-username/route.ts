import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  //connecting to database
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url); //taking whole url
    //query parameter: username
    const queryParams = {
      username: searchParams.get("username"),
    };

    //validating query parameter with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameter",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking the username",
      },
      {
        status: 500,
      }
    );
  }
}
