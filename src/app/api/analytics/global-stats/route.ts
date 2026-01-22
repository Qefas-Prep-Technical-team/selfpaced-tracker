/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Channel } from "@/models/Channel";
import Newsletter from "@/models/Newsletter";
import Click from "@/models/Click";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";
    const channelId = searchParams.get("channel");

    // 1. Calculate Time Range
    const now = new Date();
    let days = 30;
    if (range === "7d") days = 7;
    if (range === "90d") days = 90;
    
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(now.getTime() - (days * 2) * 24 * 60 * 60 * 1000);

    // 2. Build Queries
    const timeFilter = { createdAt: { $gte: startDate } };
    const clickTimeFilter = { clickedAt: { $gte: startDate } }; // Click uses clickedAt

    const inquiryFilter: any = { ...timeFilter };
    if (channelId && channelId !== "all") {
      inquiryFilter.channelId = channelId;
    }

    // 3. Parallel Execution for Speed
    const [
      totalChannels,
      totalSubscribers,
      currClicks,
      prevClicks,
      currInquiries,
      prevInquiries,
      activeConvos
    ] = await Promise.all([
      Channel.countDocuments({ status: 'active' }),
      Newsletter.countDocuments(),
      Click.countDocuments(clickTimeFilter),
      Click.countDocuments({ clickedAt: { $gte: prevStartDate, $lt: startDate } }),
      Inquiry.countDocuments(inquiryFilter),
      Inquiry.countDocuments({ 
        createdAt: { $gte: prevStartDate, $lt: startDate },
        ...(channelId !== "all" && { channelId })
      }),
      Inquiry.countDocuments({ ...inquiryFilter, status: 'new' }) // 'Active' = New inquiries
    ]);

    // 4. Calculate Percentage Changes
    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    return NextResponse.json({
      channels: totalChannels,
      clicks: {
        value: currClicks >= 1000 ? `${(currClicks / 1000).toFixed(1)}k` : currClicks.toString(),
        change: calcChange(currClicks, prevClicks),
        type: currClicks >= prevClicks ? 'positive' : 'negative'
      },
      inquiries: {
        value: currInquiries.toString(),
        change: calcChange(currInquiries, prevInquiries),
        type: currInquiries >= prevInquiries ? 'positive' : 'negative'
      },
      conversations: activeConvos.toString(),
      subscribers: totalSubscribers.toLocaleString()
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}