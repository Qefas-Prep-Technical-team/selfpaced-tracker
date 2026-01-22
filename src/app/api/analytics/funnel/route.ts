/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";
    const channelId = searchParams.get("channel");

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const filter: any = { createdAt: { $gte: startDate } };
    if (channelId && channelId !== "all") filter.channelId = channelId;

    // Aggregate counts for each status
    const stats = await Inquiry.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const findCount = (status: string) => stats.find(s => s._id === status)?.count || 0;

    const newCount = findCount('new');
    const contactedCount = findCount('contacted');
    const followUpCount = findCount('follow-up');

    // Funnel Logic: Contacted includes follow-ups, New includes everything
    const steps = [
      { label: 'Total Inquiries', value: newCount + contactedCount + followUpCount },
      { label: 'Contacted', value: contactedCount + followUpCount },
      { label: 'Follow-up', value: followUpCount }
    ];

    const data = steps.map(step => ({
      ...step,
      percentage: steps[0].value > 0 ? Math.round((step.value / steps[0].value) * 100) : 0
    }));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Funnel failed" }, { status: 500 });
  }
}