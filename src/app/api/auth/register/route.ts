import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { IUser } from "@/models/models.types";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import {
  isValidPhone,
  isValidEmail,
  randomString,
  normalizePhone,
} from "@/utils/validations";

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      agreedToTerms,
      referralCode: incomingCode,
    } = await req.json();

    // Basic field presence check
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      agreedToTerms !== true
    ) {
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

    const normalizedPhone = normalizePhone(phone);
    if (!isValidPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // 2. Connect & uniqueness check
    await connectToDatabase();
    if (await User.exists({ email: normalizedEmail })) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }
    // 3. Handle incoming referral
    let referrer: IUser | null = null;
    if (incomingCode) {
      referrer = await User.findOne({ referralCode: incomingCode });
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code." },
          { status: 400 }
        );
      }
    }

    async function generateUniqueReferralCode(email: string): Promise<string> {
      const prefix = email.split("@")[0];
      let code: string;
      do {
        code = `${prefix}-${randomString(6)}`;
      } while (await User.exists({ referralCode: code }));
      return code;
    }

    // 4. Generate this user’s own referral code
    const myReferralCode = await generateUniqueReferralCode(normalizedEmail);

    // 5. Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();
    const effectUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newUser = (await User.create({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
      agreedToTerms,
      referralCode: myReferralCode,
      referredBy: referrer ? referrer._id : null,
    })) as IUser & { _id: mongoose.Types.ObjectId };

    // 6. Update referrer (if any)
    if (referrer) {
      // Set or extend the referrer’s benefit window
      const now = new Date();
      const newEffect = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 DAYS EXTA 10% BONUS FOR THE REFERREE

      // Optional: Only extend if it's shorter
      if (
        !referrer.referralEffectExpired ||
        referrer.referralEffectExpired < newEffect
      ) {
        referrer.referralEffectExpired = newEffect;
        await referrer.save();
      }
    }

    return NextResponse.json(
      {
        message: "User registered successfully.",
        referralCode: myReferralCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
