import mongoose, { Schema } from "mongoose";
import { IDeposit } from "./models.types";

const depositSchema = new mongoose.Schema<IDeposit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    proofImage: { type: String },
    proofImageVerified: { type: Boolean, default: false },
    method: { type: String, enum: ["bank", "easypaisa", "jazzcash"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Deposit = mongoose.models.Deposit || mongoose.model<IDeposit>("Deposit", depositSchema);
