// app/api/inquiries/track-click/locations/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET() {
  try {
    await dbConnect();
    const totalClicks = await Click.countDocuments();

    const cityData = await Click.aggregate([
      {
        $group: {
          _id: "$city", // Changed from $country to $city
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }, // Show top 6 cities
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

    return NextResponse.json({ success: true, data: cityData });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch city stats" }, { status: 500 });
  }
}