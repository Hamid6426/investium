import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Investment from "@/models/Investment";
import Plan from "@/models/Plan";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const decodedUser = getUserFromRequest(req);
    const userId = new mongoose.Types.ObjectId(decodedUser.id);

    // Step 1: Get investments for user
    const investments = await Investment.find({ userId });

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    let totalEarnings = 0;

    // Step 2: Manually fetch plans and calculate
    await Promise.all(
      investments.map(async (inv: any) => {
        const plan = await Plan.findById(inv.planId);
        if (!plan) return;

        const { startDate, currentDay, quantity } = inv;

        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + currentDay - 1);

        const rangeStart = sevenDaysAgo > start ? sevenDaysAgo : start;
        const rangeEnd = today < end ? today : end;

        const daysInRange = Math.max(
          0,
          Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        );

        totalEarnings += daysInRange * quantity * plan.dailyReturned;
      })
    );

    return NextResponse.json({ weeklyEarnings: totalEarnings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to calculate weekly earnings" },
      { status: 500 }
    );
  }
}
