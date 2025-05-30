import mongoose, { Model, Schema } from "mongoose";
import { IInvestment } from "./models.types";

const investmentSchema = new Schema<IInvestment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, required: true },
    currentDay: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Investment: Model<IInvestment> =
  mongoose.models.Investment ||
  mongoose.model<IInvestment>("Investment", investmentSchema);
export default Investment;
