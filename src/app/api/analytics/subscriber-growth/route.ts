import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const growthData = await Newsletter.aggregate([
      { $match: { subscribedAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" } },
          newSubscribers: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format for Recharts
    let totalSoFar = await Newsletter.countDocuments({ subscribedAt: { $lt: startDate } });
    const formattedData = growthData.map(day => {
      totalSoFar += day.newSubscribers;
      return {
        date: new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: totalSoFar
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch growth" }, { status: 500 });
  }
}