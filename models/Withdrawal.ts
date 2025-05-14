import mongoose, { Schema } from "mongoose";
import { IWithdrawalRequest } from "./models.types";

const withdrawalSchema = new Schema<IWithdrawalRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    method: { type: String, enum: ["bank", "easypaisa", "jazzcash"], required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNotes: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Withdrawal = mongoose.models.Withdrawal || mongoose.model<IWithdrawalRequest>("Withdrawal", withdrawalSchema);
