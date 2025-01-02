import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { User } from "next-auth";

export async function POST(request: Request) {
  //connect to the database
  await dbConnect();

  //get the user session
  const session = await getServerSession(options);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { error: "You must be signed in to accept messages." },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    //update the user's accept messages status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true } //again back to default value
    );

    // User not found
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }
    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update accept messages status", error);
    return Response.json(
      { success: false, error: "Failed to update accept messages status" },
      { status: 500 }
    );
  }
}

export async function GET() {
  //connect to the database
  await dbConnect();

  //get the user session
  const session = await getServerSession(options);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { error: "You must be signed in to accept messages." },
      { status: 401 }
    );
  }

  try {
    //get the user's accept messages status
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to get message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully retrieved message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status retrieved successfully",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get accept messages status", error);
    return Response.json(
      { success: false, error: "Failed to get accept messages status" },
      { status: 500 }
    );
  }
}
