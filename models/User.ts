import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "./models.types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    agreedToTerms: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    referralCode: { type: String, default: null },
    dob: { type: String },
    cnic: { type: String },
    securityAnswer: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    isSecured: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    isBlocked: { type: Boolean, default: false },
    payoutDetails: {
      method: {
        type: String,
        enum: ["bank", "easypaisa", "jazzcash"],
        required: true,
      },
      accountName: { type: String },
      accountNumber: { type: String },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
