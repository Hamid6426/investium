import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  phone: string;
  agreedToTerms: boolean;
  referralCode: string;
  image: string;
  dob?: string;
  cnic?: string;
  securityAnswer?: string | null;
  isVerified?: boolean | null;
  isSecured?: boolean | null;
  verifiedAt?: Date | null;
  isBlocked?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  payoutDetails: {
    method: "bank" | "easypaisa" | "jazzcash";
    accountName?: string;
    accountNumber?: string;
  };
}

export interface IPlan extends Document {
  name: string;
  description: string;
  image: string;
  rupees: number;
  dailyReturn: number;
  totalRevenue: number;
  capitalReturn: boolean;
  returnType: string;
  periodType: "daily" | "weekly" | "monthly" | "yearly";
  totalPeriods: number;
  cancellation: boolean;
  status?: "active" | "inactive";
  isFeatured?: boolean;
}

export type TransactionType = "deposit" | "withdraw" | "investment" | "payout";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId | IUser;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  method?: string;
  plan?: mongoose.Types.ObjectId | IPlan;
  fees?: number;
  periodsRemaining?: number;
  returnType?: string;
  proofImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
