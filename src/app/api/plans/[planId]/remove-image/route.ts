import { NextRequest, NextResponse } from "next/server";
import Plan from "@/models/Plan";
import connectToDatabase from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function DELETE(req: NextRequest, { params }: { params: { planId: string } }) {
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
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    if (plan.image) {
      const filePath = path.join(process.cwd(), "public", plan.image);
      await fs.unlink(filePath).catch(() => {}); // Ignore if already missing
      plan.image = "";
      await plan.save();
    }

    return NextResponse.json({ message: "Image removed" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
