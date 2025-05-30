import { NextRequest, NextResponse } from "next/server";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { Types } from "mongoose"; // Correct import for ObjectId
import Withdrawal from "@/models/Withdrawal";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ withdrawalId: string }> }
) {
  try {
    await connectToDatabase();
    const { withdrawalId } = await params;

    const decodedAdmin = getUserFromRequest(req);
    if (!decodedAdmin || !["admin", "superadmin"].includes(decodedAdmin.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminNotes } = await req.json();
    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal || withdrawal.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed" },
        { status: 400 }
      );
    }

    // Refund amount back to user i.e the money subtracted when making withdrawal request
    const userToRefund = await User.findById(withdrawal.userId);
    if (userToRefund) {
      userToRefund.walletBalance += withdrawal.amount;
      await userToRefund.save();
    }

    withdrawal.status = "rejected";
    withdrawal.adminNotes = adminNotes || "";
    withdrawal.processedBy = new Types.ObjectId(decodedAdmin.id);

    await withdrawal.save();
    return NextResponse.json(withdrawal, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
