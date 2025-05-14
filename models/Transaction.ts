import mongoose, { Schema, Model } from "mongoose";
import { ITransaction } from "./models.types";

const TransactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "investment", "payout"], // user actions: deposit, withdraw, invest | admin action: payout after return calculation
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "PKR" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
    method: { type: String },
    plan: { type: Schema.Types.ObjectId, ref: "Plan" },
    fees: { type: Number, default: 0 },
    periodsRemaining: { type: Number },
    returnType: { type: String },
    proofImage: {
      type: String,
      required: function () {
        return this.type === "deposit";
      },
    },
  },
  { timestamps: true }
);

// Optimized user transaction lookup
TransactionSchema.index({ user: 1, createdAt: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
