import bcrypt from "bcryptjs";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { passwordResetLimiter } from "@/middlewares/rateLimiters";

export async function POST(req: NextRequest) {
  try {
    passwordResetLimiter(req);

    const { email, securityAnswer, newPassword } = await req.json();

    if (!email || !securityAnswer || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    if (!user.securityAnswer) {
      return NextResponse.json(
        { error: "Security answer not set." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect security answer." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return NextResponse.json(
        { error: "New password should be different from the old one." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    const errorMessage =
      error.message ===
      "Too many password reset attempts. Try again after an hour."
        ? error.message
        : "Internal server error.";
    const status = error.message.includes("Too many") ? 429 : 500;

    console.error("Forgot password error:", error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
