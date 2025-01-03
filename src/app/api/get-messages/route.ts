import UserModel from "@/models/UserModel";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  //connect to the database
  await dbConnect();

  //get the session
  const session = await getServerSession(options);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        error: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.timestamp": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching messages", error);
    return Response.json(
      {
        success: false,
        error: "Error fetching messages",
      },
      {
        status: 500,
      }
    );
  }
}
