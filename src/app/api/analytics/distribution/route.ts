import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const stats = await Conversation.aggregate([
      { $match: { lastMessageAt: { $gte: startDate } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    // Map into your UI distribution structure
    const data = ['bot', 'human'].map(type => {
      const found = stats.find(s => s._id === type);
      const count = found ? found.count : 0;
      return {
        type,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch distribution" }, { status: 500 });
  }
}