import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "6m";
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const now = new Date();
    let startDate: Date;
    let endDate = new Date();
    let monthsToFetch = 6;

    if (fromStr) {
      startDate = new Date(fromStr);
      if (toStr) endDate = new Date(toStr);
      // Calculate diff in months for the table generation
      monthsToFetch = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    } else {
      if (range === "3m") monthsToFetch = 3;
      if (range === "12m") monthsToFetch = 12;
      startDate = new Date(now.getFullYear(), now.getMonth() - monthsToFetch + 1, 1);
    }

    const matchFilter: any = { createdAt: { $gte: startDate, $lte: endDate } };

    // Aggregate Inquiries by Month and Channel
    const trends = await Inquiry.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            channel: "$channelName"
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          channel: "$_id.channel",
          count: 1,
          _id: 0
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Format data for Recharts: { month: 'Jan', Facebook: 10, Google: 5, ... }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData: any[] = [];
    const monthsMap: Record<string, any> = {};

    // Generate all months in range to ensure they exist in output
    for (let i = 0; i < monthsToFetch; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        if (d > endDate) break;
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        monthsMap[key] = { name: key };
        formattedData.push(monthsMap[key]);
    }

    trends.forEach(t => {
        const key = `${monthNames[t.month - 1]} ${t.year}`;
        if (monthsMap[key]) {
            monthsMap[key][t.channel] = t.count;
        }
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Channel Trends Error:", error);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
