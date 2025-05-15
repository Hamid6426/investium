import mongoose, { Schema } from "mongoose";
import { IPlan } from "./models.types";

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    baseInvestedAmount: { type: Number, required: true },
    dailyReturned: { type: Number, required: true },
    totalPeriods: { type: Number, required: true },
    cancellation: { type: Boolean, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan =
  mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);
