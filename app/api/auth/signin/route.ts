import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import { loginAttemptsLimiter } from "@/middlewares/rateLimiters";

export async function POST(req: NextRequest) {
  try {
    // await loginAttemptsLimiter(req);

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();
    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "You are not verified by the admin yet. Try again later." },
        { status: 409 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    // Generate a JWT token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSecured: user.isSecured
      },
      secret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Authentication successful
    return NextResponse.json(
      {
        message: "Signin successful.",
        token, // Return the token to the client
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
