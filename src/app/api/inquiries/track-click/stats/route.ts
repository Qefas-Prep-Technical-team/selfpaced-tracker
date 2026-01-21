import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLast = new Date(now.getFullYear(), now.getMonth(), 0);

    // Helper to calculate Unique Visitors via Fingerprinting
    const getUniqueCount = async (startDate: Date, endDate?: Date) => {
      const matchStage = endDate 
        ? { clickedAt: { $gte: startDate, $lte: endDate } }
        : { clickedAt: { $gte: startDate } };

      const result = await Click.aggregate([
        { $match: matchStage },
        {
          $group: {
            // Fingerprint: Combination of UA, City, and Country
            _id: { ua: "$userAgent", city: "$city", country: "$country" }
          }
        },
        { $count: "count" }
      ]);
      return result[0]?.count || 0;
    };

    // Parallel execution for speed
    const [
      currTotal, lastTotal,
      currUniques, lastUniques
    ] = await Promise.all([
      Click.countDocuments({ clickedAt: { $gte: startOfCurrent } }),
      Click.countDocuments({ clickedAt: { $gte: startOfLast, $lte: endOfLast } }),
      getUniqueCount(startOfCurrent),
      getUniqueCount(startOfLast, endOfLast)
    ]);

    const calcChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat(((curr - prev) / prev * 100).toFixed(1));
    };

    // Conversion: How many unique visitors relative to total clicks
    const currConv = currTotal > 0 ? (currUniques / currTotal) * 100 : 0;
    const lastConv = lastTotal > 0 ? (lastUniques / lastTotal) * 100 : 0;

    return NextResponse.json({
      success: true,
      stats: {
        clicks: { 
            value: currTotal, 
            change: calcChange(currTotal, lastTotal) 
        },
        uniques: { 
            value: currUniques, 
            change: calcChange(currUniques, lastUniques) 
        },
        conversion: { 
            value: currConv.toFixed(1), 
            change: calcChange(currConv, lastConv) 
        }
      }
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}