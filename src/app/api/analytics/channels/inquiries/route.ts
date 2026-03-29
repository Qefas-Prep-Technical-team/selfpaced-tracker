import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const channelName = searchParams.get("channel");
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "10");
    const studentClass = searchParams.get("class");
    const status = searchParams.get("status");

    if (!channelName) {
      return NextResponse.json({ error: "Channel name is required" }, { status: 400 });
    }

    let startDate: Date;
    let endDate = new Date();

    if (fromStr) {
      startDate = new Date(fromStr);
      if (toStr) endDate = new Date(toStr);
    } else {
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const query: any = {
      channelName: channelName,
      createdAt: { $gte: startDate, $lte: endDate }
    };

    if (studentClass && studentClass !== 'all') query.studentClass = studentClass;
    if (status && status !== 'all') query.status = status;

    const inquiries = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Channel Inquiries API Error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
