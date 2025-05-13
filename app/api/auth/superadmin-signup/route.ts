// api/auth/superadmin-signup
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/mongodb";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Ensure the phone number starts with +92 and is followed by 9 digits
  return /^\+92\d{10}$/.test(phone);
}

function normalizePhone(phone: string): string {
  // Trim the phone number to remove any extra spaces
  let normalized = phone.trim();

  // If the number starts with '0', remove the leading '0' and add the country code +92
  if (normalized.startsWith("0")) {
    normalized = normalized.slice(1); // Remove the leading '0'
  }

  // Add the Pakistan country code +92
  return `+92${normalized}`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      cnic,
      securityAnswer,
    } = await req.json();

    // Basic field presence check
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !dob ||
      !cnic ||
      !securityAnswer
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedDOB = dob.trim();
    const trimmedCNIC = cnic.trim();
    const trimmedSecurityAnswer = securityAnswer.trim();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Normalize phone number (removes leading zero and adds +92)
    const normalizedPhone = normalizePhone(trimmedPhone);

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

    await connectToDatabase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    const existingPhone = await User.findOne({ phone: normalizedPhone });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already in use." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedDOB = await bcrypt.hash(trimmedDOB, 12);
    const hashedCNIC = await bcrypt.hash(trimmedCNIC, 12);
    const hashedSecurityAnswer = await bcrypt.hash(trimmedSecurityAnswer, 12);

    await User.create({
      name: `${trimmedFirstName} ${trimmedLastName}`,
      email: normalizedEmail,
      password: hashedPassword,
      dob: hashedDOB,
      cnic: hashedCNIC,
      securityAnswer: hashedSecurityAnswer,
      phone: normalizedPhone, // Save the normalized phone number
    });

    return NextResponse.json(
      { message: "User registered successfully." },
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
