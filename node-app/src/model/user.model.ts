import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "seller" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  resetCode?: string| undefined;
  resetCodeExpiration?: Date| undefined;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
      required: true,
    },
    resetCode: {
      type: String,
      select: false, 
  },
    resetCodeExpiration: {
      type: Date,
      select: false, 
    },
  },

  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
