import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET() {
  try {
    await dbConnect();
    const recentClicks = await Click.find()
      .sort({ clickedAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ success: true, data: recentClicks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch live feed" }, { status: 500 });
  }
}