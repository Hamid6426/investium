import mongoose, { Schema, Document } from "mongoose";

// Define the User document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;

  isVerified?: boolean;
  verifiedAt?: Date;
  verificationToken?: string;
  verificationTokenExpire?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema(
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
      enum: ["user", "admin", "superadmin"],
      required: true,
      default: "receiver",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpire: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model or reuse the existing one
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
