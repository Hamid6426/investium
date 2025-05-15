import { NextRequest, NextResponse } from "next/server";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import { Types } from "mongoose"; // Correct import for ObjectId

export async function PUT(
  req: NextRequest,
  { params }: { params: { depositId: string } }
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

    const deposit = await Deposit.findById(params.depositId);
    if (!deposit || deposit.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed deposit" },
        { status: 400 }
      );
    }

    const user = await User.findById(deposit.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update deposit
    deposit.status = "completed";
    deposit.proofImageVerified = true;
    // deposit.modifiedBy = admin._id as Types.ObjectId; // This should work if `modifiedBy` is of type ObjectId in the schema
    // Method 1: Convert string to ObjectId (if admin._id is a string)
    // deposit.modifiedBy = new Types.ObjectId(admin._id); have error
    // Method 2: Cast only if you're certain admin._id is already an ObjectId
    deposit.modifiedBy = admin._id as Types.ObjectId; // Less safe but works
    await deposit.save();

    // Update user balance
    user.walletBalance += deposit.amount;
    await user.save();

    return NextResponse.json({ message: "Deposit accepted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
