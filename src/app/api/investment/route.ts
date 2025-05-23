import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Investment from "@/models/Investment";
import Plan from "@/models/Plan";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { planId, quantity } = await req.json();

    if (!planId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: "Plan not found or inactive" },
        { status: 404 }
      );
    }

    const totalCost = plan.baseInvestedAmount * quantity;

    const investingUser = await User.findById(user.id);
    if (!investingUser || investingUser.walletBalance < totalCost) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct balance
    investingUser.walletBalance -= totalCost;
    await investingUser.save();

    // Create investment
    const newInvestment = await Investment.create({
      userId: investingUser._id,
      planId,
      quantity,
      startDate: new Date(),
      currentDay: 1,
    });

    return NextResponse.json(newInvestment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserFromRequest(req).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const investments = await Investment.find({ userId }).populate(
      "planId"
    );

    return NextResponse.json(investments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
