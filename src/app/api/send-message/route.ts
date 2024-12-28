import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { Message } from "@/models/UserModel";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
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

    //check if user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          error: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    //create the message
    const newMessage = { content, timestamp: new Date() };

    //add the message to the user
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending message", error);
    return Response.json(
      {
        success: false,
        error: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
