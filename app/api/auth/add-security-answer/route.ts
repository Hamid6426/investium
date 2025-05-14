import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import connectToDatabase from "@/utils/mongodb";
import jwt from "jsonwebtoken"; // Import the jwt library to generate new tokens

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

    if (!securityAnswer.trim()) {
      return NextResponse.json(
        { error: "Answer cannot be empty or just spaces." },
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

    // Step 4: Hash and save the security answer
    const hashedAnswer = await bcrypt.hash(securityAnswer, 12);
    user.securityAnswer = hashedAnswer;
    user.isSecured = true;
    await user.save();

    // Step 5: Generate a new token with updated user information
    const updatedToken = jwt.sign(
      {
        id: user._id,
        isSecured: user.isSecured, // Now we know if account is secured or not
      },
      process.env.JWT_SECRET as string, // Replace with your actual JWT secret
      { expiresIn: "1d" } // Token expiration time (e.g., 1 day)
    );

    // Return the success message along with the updated token
    return NextResponse.json({
      message: "Security answer set successfully.",
      token: updatedToken, // Return the updated token
    });
  } catch (error) {
    console.error("Security question error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
