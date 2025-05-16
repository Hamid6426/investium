// app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // your Mongoose model
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Not allowed to create plan" },
        { status: 401 }
      );
    }

    const user = await User.findById(decodedUser.id).select(
      "_id name email phone role createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
