import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import Withdrawal from "@/models/Withdrawal";

export async function PUT(
  req: NextRequest,
  { params }: { params: { withdrawalId: string } }
) {
  try {
    await connectToDatabase();

    const decodedAdmin = getUserFromRequest(req);
    if (
      !decodedAdmin ||
      (decodedAdmin.role !== "admin" && decodedAdmin.role !== "superadmin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await User.findById(decodedAdmin.id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const withdrawal = await Withdrawal.findById(params.withdrawalId);
    if (!withdrawal || withdrawal.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed" },
        { status: 400 }
      );
    }

    // Refund amount back to user
    const userToRefund = await User.findById(withdrawal.userId);
    if (userToRefund) {
      userToRefund.walletBalance += withdrawal.amount;
      await userToRefund.save();
    }

    withdrawal.status = "approved";
    withdrawal.processedBy = admin.id;

    await withdrawal.save();
    return NextResponse.json(withdrawal, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
