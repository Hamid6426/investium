import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  phone: string;
  securityAnswer?: string | null; // Store the hashed answer or null
  isVerified?: boolean;
  isBlocked?: boolean;
  verifiedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    securityAnswer: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false }, // will be done by admin manually
    verifiedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

// If you had to compare yourself to an animal, what would it be and why?
