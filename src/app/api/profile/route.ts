// app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // your Mongoose model
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const decodedUser = await getUserFromRequest(req);

    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decodedUser.id).select(
      "_id name email phone role createdAt image walletBalance"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
