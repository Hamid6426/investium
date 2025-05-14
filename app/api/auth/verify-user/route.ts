import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function POST(req: NextRequest) {
  try {
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "User not authorized for this request" },
        { status: 401 }
      );
    }

    const { userId, isVerified } = await req.json();

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "isVerified must be a boolean" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isVerified) {
      user.isVerified = true;
      user.verifiedAt = new Date();
      await user.save();

      return NextResponse.json({
        message: "User has been successfully verified.",
        user,
      });
    } else {
      await User.findByIdAndDelete(userId);

      return NextResponse.json({
        message: "User has been rejected and deleted from the database.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
