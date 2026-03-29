import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const studentClass = searchParams.get("class");
    const status = searchParams.get("status");

    let startDate: Date;
    let endDate = new Date();

    if (fromStr) {
      startDate = new Date(fromStr);
      if (toStr) endDate = new Date(toStr);
    } else {
      const days = parseInt(range) || 30;
      startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const matchFilter: any = { createdAt: { $gte: startDate, $lte: endDate } };
    if (studentClass && studentClass !== 'all') matchFilter.studentClass = studentClass;
    if (status && status !== 'all') matchFilter.status = status;

    // Aggregate Inquiries by Channel
    const performance = await Inquiry.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$channelName",
          leads: { $sum: 1 },
          messages: { 
            $sum: { $cond: [{ $ne: ["$status", "new"] }, 1, 0] } 
          }
        }
      },
      { $project: { name: "$_id", leads: 1, messages: 1, _id: 0 } },
      { $sort: { leads: -1 } }
    ]);

    return NextResponse.json(performance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch performance" }, { status: 500 });
  }
}