import { NextRequest, NextResponse } from "next/server";
import Plan from "@/models/Plan";
import connectToDatabase from "@/utils/mongodb";
import { uploadImage } from "@/utils/uploadImage";
import fs from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function PUT(
  req: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    await connectToDatabase();
    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Not allowed to create plan" },
        { status: 401 }
      );
    }

    const plan = await Plan.findById(params.planId);
    if (!plan)
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // Delete old image just in case
    if (plan.image) {
      const oldImagePath = path.join(process.cwd(), "public", plan.image);
      await fs.unlink(oldImagePath).catch(() => {}); // ignore if file not found
    }

    const newImageUrl = await uploadImage(file);
    plan.image = newImageUrl;
    await plan.save();

    return NextResponse.json(
      { message: "Image updated", imageUrl: newImageUrl },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
