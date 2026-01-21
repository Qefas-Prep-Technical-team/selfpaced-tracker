import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET() {
  try {
    await dbConnect();

    // 1. Get total clicks for CTR calculation
    const totalClicks = await Click.countDocuments();

    // 2. Aggregate top elements
    const topElements = await Click.aggregate([
      {
        $group: {
          _id: { label: "$label", path: "$path", category: "$category" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$_id.label",
          location: "$_id.path",
          category: "$_id.category",
          clicks: "$count",
          // CTR relative to all clicks on the site
          ctr: { $multiply: [{ $divide: ["$count", totalClicks || 1] }, 100] }
        }
      }
    ]);

    return NextResponse.json({ success: true, data: topElements });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch elements" }, { status: 500 });
  }
}