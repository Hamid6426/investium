import { NextRequest, NextResponse } from "next/server";
import Plan from "@/models/Plan";
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";
import { uploadImage } from "@/utils/uploadImage";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const decodedUser = getUserFromRequest(req);

    if (decodedUser.role !== "admin" && decodedUser.role !== "superadmin") {
      return NextResponse.json(
        { error: "Not allowed to create plan" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const baseInvestedAmount = Number(formData.get("baseInvestedAmount"));
    const dailyReturned = Number(formData.get("dailyReturned"));
    const totalPeriods = Number(formData.get("totalPeriods"));
    const cancellation = formData.get("cancellation") === "true";
    const isActive = formData.get("isActive") === "true";

    const errors: string[] = [];

    if (!name || typeof name !== "string")
      errors.push('Invalid or missing "name"');
    if (isNaN(baseInvestedAmount))
      errors.push('Invalid or missing "baseInvestedAmount"');
    if (isNaN(dailyReturned)) errors.push('Invalid or missing "dailyReturned"');
    if (isNaN(totalPeriods)) errors.push('Invalid or missing "totalPeriods"');
    if (typeof cancellation !== "boolean")
      errors.push('Invalid or missing "cancellation"');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Upload the image (optional)
    const imageUrl = file ? await uploadImage(file) : "";

    const newPlan = new Plan({
      name,
      description,
      image: imageUrl,
      baseInvestedAmount,
      dailyReturned,
      totalPeriods,
      cancellation,
      isActive: isActive ?? true,
    });

    const savedPlan = await newPlan.save();
    return NextResponse.json(savedPlan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Get all plans
export async function GET() {
  try {
    await connectToDatabase();
    const plans = await Plan.find();

    return NextResponse.json(plans, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
