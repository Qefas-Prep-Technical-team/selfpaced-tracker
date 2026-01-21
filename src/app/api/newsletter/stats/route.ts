import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [total, currentPeriod, previousPeriod] = await Promise.all([
      Newsletter.countDocuments(),
      Newsletter.countDocuments({ subscribedAt: { $gte: thirtyDaysAgo } }),
      Newsletter.countDocuments({ 
        subscribedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      })
    ]);

    const calcChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat(((curr - prev) / prev * 100).toFixed(1));
    };

    const growthChange = calcChange(currentPeriod, previousPeriod);

    return NextResponse.json({
      total: {
        value: total.toLocaleString(),
        change: `${growthChange >= 0 ? '+' : ''}${growthChange}%`,
        type: growthChange >= 0 ? 'positive' : 'negative'
      },
      newThisMonth: {
        value: currentPeriod.toLocaleString(),
        // Calculating what % of total is new
        percentage: total > 0 ? (currentPeriod / total) * 100 : 0
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Stats failed" }, { status: 500 });
  }
}