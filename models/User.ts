import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "./models.types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    agreedToTerms: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    image: String,
    dob: String,
    cnic: String,
    walletBalance: { type: Number, default: 0 },
    isSecured: { type: Boolean, default: false },
    securityAnswer: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: null },
    referralCode: { type: String, default: null, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    referralEffectExpired: { type: Date, default: null },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;

// HOW TO USE REFER BONUS
// if (user.referredBy) {
//   const referrer = await User.findById(user.referredBy);

//   if (referrer.referralEffectExpired > new Date()) {
//     // Give referrer 10% of user's earnings
//   }
// }
