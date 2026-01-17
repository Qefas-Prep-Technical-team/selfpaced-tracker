/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";


export async function GET() {
    const now = new Date()

const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  try {
    await dbConnect();

const stats = await Inquiry.aggregate([
  {
    $facet: {
      currentMonth: [
        {
          $match: {
            createdAt: { $gte: startOfCurrentMonth }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ],
      previousMonth: [
        {
          $match: {
            createdAt: {
              $gte: startOfPreviousMonth,
              $lte: endOfPreviousMonth
            }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]
    }
  }
])

const normalize = (data: any[]) => {
  const base:any = {
    total: 0,
    new: 0,
    contacted: 0,
    followup: 0
  }

  data.forEach((item:any) => {
    base.total += item.count
    if (item._id in base) {
      base[item._id] = item.count
    }
  })

  return base
}

const current = normalize(stats[0].currentMonth)
const previous = normalize(stats[0].previousMonth)

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return 100
  return Number((((current - previous) / previous) * 100).toFixed(2))
}



    // Normalize response
    // const result = {
    //   total: 0,
    //   new: 0,
    //   contacted: 0,
    //   followup: 0,
    // };

    // stats.forEach((item: any) => {
    //   result.total += item.count;
    //   if (item._id in result) {
    //     // @ts-expect-error
    //     result[item._id] = item.count;
    //   }
    // });

    return NextResponse.json({
  success: true,
  stats: {
    total: {
      current: current.total,
      previous: previous.total,
      percentageChange: calculateChange(current.total, previous.total)
    },
    new: {
      current: current.new,
      previous: previous.new,
      percentageChange: calculateChange(current.new, previous.new)
    },
    contacted: {
      current: current.contacted,
      previous: previous.contacted,
      percentageChange: calculateChange(current.contacted, previous.contacted)
    },
    followup: {
      current: current.followup,
      previous: previous.followup,
      percentageChange: calculateChange(current.followup, previous.followup)
    }
  }
})

  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
