import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { id: userId, role: userRole } = getUserFromRequest(req);

    const { resetToken, newPassword } = await req.json();

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { error: "Reset token and new password are required." },
        { status: 400 }
      );
    }

    if (userRole !== "superadmin") {
      return NextResponse.json(
        { error: "Unauthorized: Only superadmin can reset password." },
        { status: 403 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json(
      { message: `Password reset successfully by ${userId}` },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
