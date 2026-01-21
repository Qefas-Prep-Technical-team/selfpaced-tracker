import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET() {
  try {
    await dbConnect();

    const totalClicks = await Click.countDocuments();

    const locationData = await Click.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Get top 5 countries
      {
        $project: {
          _id: 0,
          name: { $ifNull: ["$_id", "Unknown"] },
          percentage: { 
            $round: [{ $multiply: [{ $divide: ["$count", totalClicks || 1] }, 100] }, 1] 
          }
        }
      }
    ]);

    return NextResponse.json({ success: true, data: locationData });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}