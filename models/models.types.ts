// models/models.types.ts
import mongoose, { Document } from "mongoose";

/**
 * IUser interface represents the schema for a user in the system.
 */
export interface IUser extends Document {
  name: string; // Full name of the user
  email: string; // Email address of the user (must be unique)
  phone: string; // User's phone number (must be unique too)
  password: string; // User password (must be hashed for security purposes)
  role: "user" | "admin" | "superadmin"; // Role of the user in the system
  agreedToTerms: boolean; // Whether the user has agreed to the terms and conditions
  image?: string | null; // URL or path to the user's profile image
  dob?: string; // Date of Birth (optional)
  cnic?: string; // CNIC (must be hashed to protect sensitive data)
  walletBalance: number; // User's wallet balance, initially set to 0
  isSecured?: boolean | null; // Indicates if the user has answered the security question
  securityAnswer?: string | null; // Security answer for account recovery (must be hashed)
  isBlocked?: boolean; // Indicates if the user is blocked for any reason
  blockReason?: string | null; // Reason for blocking the user (optional)
  referralCode: string | null; // Referral code generated for the user in the format ${user.email}-${sixRandomNumberGenerator}
  referredBy: mongoose.Types.ObjectId | null; // Reference to the user who referred this user (null if not referred)
  referralEffectExpired?: Date | null; // Expiration date for the referral bonus validity (e.g., 30 days) | null If a user was never referredF
}

/**
 * IPlan interface represents the schema for an investment plan.
 */
export interface IPlan extends Document {
  name: string; // Name of the plan (e.g., solar-1, property-3)
  description?: string; // not required in design but let me add this in schema
  baseInvestedAmount: number; // Base amount required to invest in the plan
  dailyReturned: number; // Daily return amount based on the base investment
  totalPeriods: number; // Total number of days the investment runs (e.g., 90 days)
  cancellation: boolean; // Indicates if the plan allows cancellation
  isActive: boolean; // default: true
}

/**
 * IDeposit interface represents the schema for a user's deposit record.
 */
export interface IDeposit extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user making the deposit
  accountName: string; // Account name used for the deposit
  accountNumber: string; // Account number used for the deposit
  amount: number; // Amount deposited by the user
  currency: string; // Currency of the deposited amount
  proofImage?: string; // URL or path to the proof of deposit image (e.g., screenshot)
  proofImageVerified?: boolean; // Indicates if the proof image has been verified by an admin
  method: "bank" | "easypaisa" | "jazzcash"; // Method of deposit
  status: "pending" | "completed" | "failed"; // Status of the deposit
  modifiedBy?: mongoose.Types.ObjectId; // Admin who modified the status of the deposit
}

/**
 * IInvestment interface represents the schema for a user's investment.
 */
export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user making the investment
  planId: mongoose.Types.ObjectId; // Reference to the investment plan
  quantity: number; // Number of units of the plan purchased by the user
  startDate: Date; // Start date of the investment (Day 1 of investment)
  currentDay: number; // Current day in the investment lifecycle (e.g., between day 1 and 90)
  isCompleted: boolean; // Indicates if the investment is completed (e.g., after 90 days)
}

/**
 * IWithdrawalRequest interface represents the schema for a user's withdrawal request.
 */
export interface IWithdrawalRequest extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user making the withdrawal request
  accountName: string; // Account name where the withdrawal will be sent
  accountNumber: string; // Account number where the withdrawal will be sent
  amount: number; // Amount requested for withdrawal
  currency: string; // Currency of the requested withdrawal
  method: "bank" | "easypaisa" | "jazzcash"; // Method of withdrawal
  status: "pending" | "approved" | "rejected"; // Status of the withdrawal request (rejected if the requested amount is less than available)
  adminNotes?: string; // send in case on rejection
  processedBy?: mongoose.Types.ObjectId; // Admin who processed the status of the withdrawal request
}
