import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { accountName, accountNumber, amount, currency, method } = await req.json();

    // Input validation
    if (
      !accountName || typeof accountName !== "string" ||
      !accountNumber || typeof accountNumber !== "string" ||
      !amount || typeof amount !== "number" || amount <= 0 ||
      !currency || typeof currency !== "string" ||
      !["bank", "easypaisa", "jazzcash"].includes(method)
    ) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Authenticated user
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const WithdrawalRequester = await User.findById(user.id);
    if (!WithdrawalRequester || WithdrawalRequester.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    // Deduct amount
    WithdrawalRequester.walletBalance -= amount;
    await WithdrawalRequester.save();

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: WithdrawalRequester._id,
      accountName,
      accountNumber,
      amount,
      currency,
      method,
      status: "pending"
    });

    return NextResponse.json(withdrawal, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
