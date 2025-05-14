// app/api/get-all-users/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function GET(req: NextRequest) {
  try {
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "User not authorize for this request" },
        { status: 401 }
      );
    }

    // Establish database connection
    await connectToDatabase();

    // Retrieve all users, excluding sensitive fields
    const users = await User.find(
      {},
      "-password -securityAnswer -resetPasswordToken -resetPasswordExpires"
    );

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
