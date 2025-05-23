// app/api/profile/upload-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { uploadImage } from "@/lib/uploadImage";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const decodedUser = getUserFromRequest(req);
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const imageUrl = await uploadImage(file);

    const updatedUser = await User.findByIdAndUpdate(
      decodedUser.id,
      { image: imageUrl },
      { new: true }
    ).select("_id name email phone role image");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile picture updated", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
