import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const locations = await Click.aggregate([
      { $match: { clickedAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: { $ifNull: ["$city", "Other"] }, 
          clicks: { $sum: 1 } 
        } 
      },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", clicks: 1, _id: 0 } }
    ]);

    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}