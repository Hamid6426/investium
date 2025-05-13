import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const { userId, isVerified } = await request.json();

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "isVerified must be a boolean" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.isVerified = isVerified;
    user.verifiedAt = isVerified ? new Date() : null;

    await user.save();

    const message = isVerified
      ? "User has been successfully verified."
      : "User has been rejected.";

    return NextResponse.json({
      message,
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
