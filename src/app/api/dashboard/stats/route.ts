import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Conversation from "@/models/Conversation";
import Newsletter from "@/models/Newsletter";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Helper function to calculate percentage change
    const getChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const diff = ((current - previous) / previous) * 100;
      return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    const [
      // Current Month Data
      currSubs, currInq, currConv, currHuman,
      // Previous Month Data
      prevSubs, prevInq, prevConv, prevHuman
    ] = await Promise.all([
      Newsletter.countDocuments({ subscribedAt: { $gte: thirtyDaysAgo } }),
      Inquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Conversation.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Conversation.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, status: 'human' }),
      
      Newsletter.countDocuments({ subscribedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Inquiry.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Conversation.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Conversation.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: 'human' }),
    ]);

    // Totals (for the main value display)
    const totalSubs = await Newsletter.countDocuments();
    const totalInq = await Inquiry.countDocuments();

    // AI Success Rate Calculations
    const currAiRate = currConv > 0 ? ((currConv - currHuman) / currConv) * 100 : 100;
    const prevAiRate = prevConv > 0 ? ((prevConv - prevHuman) / prevConv) * 100 : 100;
    const aiChangeNum = currAiRate - prevAiRate;

    return NextResponse.json({
      newsletter: {
        value: totalSubs.toLocaleString(),
        change: getChange(currSubs, prevSubs),
        trend: currSubs >= prevSubs ? "up" : "down"
      },
      inquiries: {
        value: totalInq.toLocaleString(),
        change: getChange(currInq, prevInq),
        trend: currInq >= prevInq ? "up" : "down"
      },
      activeChats: {
        value: currConv.toLocaleString(),
        change: getChange(currConv, prevConv),
        trend: currConv >= prevConv ? "up" : "down"
      },
      aiRate: {
        value: `${currAiRate.toFixed(1)}%`,
        change: `${aiChangeNum >= 0 ? "+" : ""}${aiChangeNum.toFixed(1)}%`,
        trend: aiChangeNum >= 0 ? "up" : "down"
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}