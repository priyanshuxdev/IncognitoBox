import { Message, User } from "@/types/types";
import mongoose, { Schema } from "mongoose";

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password is required only if not using Google auth
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values
  },
  verifyToken: {
    type: String,
    required: function () {
      return !this.googleId; // Verify token is required only if not using Google auth
    },
  },
  verifyTokenExpires: {
    type: Date,
    required: function () {
      return !this.googleId; // Verify token expiry is required only if not using Google auth
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
