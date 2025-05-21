// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

// GET user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Not authorized to view user" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(params.id).select(
      "_id name email phone role createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
}
