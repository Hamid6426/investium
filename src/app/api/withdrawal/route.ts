import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const accountName = body.accountName as string;
    const accountNumber = body.accountNumber as string;
    const amount = Number(body.amount);
    const currency = body.currency as string;
    const method = body.method as string;

    const errors: string[] = [];

    if (!accountName) errors.push("Missing 'accountName'");
    if (!accountNumber) errors.push("Missing 'accountNumber'");
    if (!currency) errors.push("Missing 'currency'");
    if (!method || !["bank", "easypaisa", "jazzcash"].includes(method))
      errors.push("Invalid or missing 'method'");
    if (isNaN(amount) || amount <= 0)
      errors.push("Amount must be greater than 0");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Authenticated user
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const withdrawalRequester = await User.findById(user.id);

    if (
      !withdrawalRequester ||
      typeof withdrawalRequester.walletBalance !== "number" ||
      withdrawalRequester.walletBalance < amount
    ) {
      return NextResponse.json(
        { error: "Insufficient wallet balance or invalid amount" },
        { status: 400 }
      );
    }

    // Deduct amount
    withdrawalRequester.walletBalance -= amount;
    await withdrawalRequester.save();

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: withdrawalRequester.id,
      accountName,
      accountNumber,
      amount,
      currency,
      method,
      status: "pending",
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Not allowed to check deposits" },
        { status: 401 }
      );
    }
    const withdrawals = await Withdrawal.find();

    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
