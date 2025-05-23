import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Investment from "@/models/Investment";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = getUserFromRequest(req);

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const investments = await Investment.find({})
      .populate("planId")
      .populate("userId", "name email walletBalance"); // only select useful fields

    return NextResponse.json(investments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
