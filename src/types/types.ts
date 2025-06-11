import { Document } from "mongoose";

export interface Message extends Document {
  content: string;
  timestamp: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  verifyToken?: string;
  verifyTokenExpires?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}
