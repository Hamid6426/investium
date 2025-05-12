import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import connectToDatabase from "@/utils/mongodb";

// POST: Set a security question (can only be done once)
export async function POST(req: NextRequest) {
  try {
    const { securityAnswer } = await req.json();

    if (!securityAnswer) {
      return NextResponse.json(
        { error: "Security answer is required." },
        { status: 400 }
      );
    }

    // Step 0: Connect to database
    await connectToDatabase;

    // Step 1: Authenticate user from token
    const decodedUser = getUserFromRequest(req);

    // Step 2: Fetch the user using ID from token
    const user = await User.findById(decodedUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Step 3: Block if already set
    if (user.securityAnswer) {
      return NextResponse.json(
        { error: "Security answer already set." },
        { status: 403 }
      );
    }

    // Step 4: Hash and save
    const hashedAnswer = await bcrypt.hash(securityAnswer, 12);
    user.securityAnswer = hashedAnswer;
    await user.save();

    return NextResponse.json({
      message: "Security answer set successfully.",
    });
  } catch (error) {
    console.error("Security question error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
