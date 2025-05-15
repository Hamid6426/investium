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

    const body = await req.json();
    const { adminNotes } = body;

    if (!adminNotes || typeof adminNotes !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid adminNotes" },
        { status: 400 }
      );
    }

    const deposit = await Deposit.findById(params.depositId);
    if (!deposit || deposit.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed deposit" },
        { status: 400 }
      );
    }

    // Update deposit
    deposit.status = "failed";
    deposit.adminNotes = adminNotes;
    deposit.modifiedBy = new Types.ObjectId(decodedAdmin.id); // convert string to objectId
    await deposit.save();

    return NextResponse.json({ message: "Deposit rejected" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
