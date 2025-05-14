import mongoose, { Schema, Model } from "mongoose";
import { IPlan } from "./models.types";

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rupees: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    capitalReturn: { type: Boolean, required: true },
    returnType: { type: String, required: true },
    periodType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    totalPeriods: { type: Number, required: true },
    cancellation: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
  