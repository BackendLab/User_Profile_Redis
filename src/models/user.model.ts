import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  bio?: string;
  createAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
