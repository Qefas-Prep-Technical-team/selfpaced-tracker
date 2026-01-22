import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    const now = new Date();
    const days = parseInt(range) || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Aggregate Inquiries by Channel
    const performance = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$channelName",
          leads: { $sum: 1 },
          // Mocking messages as "follow-ups" or "contacted" status for this chart
          messages: { 
            $sum: { $cond: [{ $ne: ["$status", "new"] }, 1, 0] } 
          }
        }
      },
      { $project: { name: "$_id", leads: 1, messages: 1, _id: 0 } },
      { $limit: 5 } // Top 5 channels
    ]);

    return NextResponse.json(performance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch performance" }, { status: 500 });
  }
}