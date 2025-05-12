// app/api/subscribe/route.js
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const subscription = await req.json();

  // Store the subscription in your database here

  return NextResponse.json({ success: true });
}