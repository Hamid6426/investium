import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the reset token and its expiration to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60 * 24 * 3; // Token valid for 3 days
    await user.save();

    // Send the reset token via restAPI and admin will update the password using the token
    
    return NextResponse.json(
      { message: "Password reset request sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password request sending error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}