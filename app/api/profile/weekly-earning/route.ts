import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Investment from "@/models/Investment";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/utils/getUserFromRequest";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const decodedUser = getUserFromRequest(req);
    const userId = new mongoose.Types.ObjectId(decodedUser.id);

    // Step 1: Fetch all user's investments with plan info
    const investments = await Investment.find({ userId }).populate("planId");

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    let totalEarnings = 0;

    investments.forEach((inv: any) => {
      const plan = inv.planId;
      const { startDate, currentDay, quantity } = inv;

      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + currentDay - 1);

      const rangeStart = sevenDaysAgo > start ? sevenDaysAgo : start;
      const rangeEnd = today < end ? today : end;

      const daysInRange = Math.max(
        0,
        Math.ceil(
          (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );

      totalEarnings += daysInRange * quantity * plan.dailyReturned;
    });

    return NextResponse.json({ weeklyEarnings: totalEarnings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to calculate weekly earnings" },
      { status: 500 }
    );
  }
}
