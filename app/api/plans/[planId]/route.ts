import { NextRequest, NextResponse } from "next/server";
import { Plan } from "@/models/Plan";
import connectToDatabase from "@/utils/mongodb";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

// GET /api/plans/:planId
export async function GET(
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
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(plan, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/plans/:planId
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
    const body = await req.json();

    const {
      name,
      description,
      baseInvestedAmount,
      dailyReturned,
      totalPeriods,
      cancellation,
      isActive,
    } = body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      params.planId,
      {
        name,
        description,
        baseInvestedAmount,
        dailyReturned,
        totalPeriods,
        cancellation,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/plans/:planId
export async function DELETE(
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
    const deleted = await Plan.findByIdAndDelete(params.planId);
    if (!deleted) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Plan deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
