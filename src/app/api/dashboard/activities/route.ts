/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Conversation from "@/models/Conversation";
import Newsletter from "@/models/Newsletter";
import { formatDistanceToNow } from "date-fns";

export async function GET() {
  try {
    await dbConnect();

    // Fetch latest records from all collections
    const [inquiries, newsletters, conversations] = await Promise.all([
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      Newsletter.find().sort({ subscribedAt: -1 }).limit(5).lean(),
      Conversation.find().sort({ lastMessageAt: -1 }).limit(5).lean()
    ]);

    // Format all sources into a single activity interface
    const activityFeed = [
      ...newsletters.map((n: any) => ({
        event: 'New Subscription',
        user: n.email.split('@')[0],
        channel: { icon: 'alternate_email', name: 'Email' },
        time: formatDistanceToNow(new Date(n.subscribedAt), { addSuffix: true }),
        timestamp: n.subscribedAt,
        status: 'success'
      })),
      ...inquiries.map((i: any) => ({
        event: 'New Inquiry',
        user: i.parentName,
        channel: { icon: 'ads_click', name: i.channelName },
        time: formatDistanceToNow(new Date(i.createdAt), { addSuffix: true }),
        timestamp: i.createdAt,
        status: 'info'
      })),
      ...conversations.map((c: any) => ({
        event: 'AI Chat Handoff',
        user: c.name || 'WhatsApp User',
        channel: { icon: 'chat', name: 'WhatsApp', color: 'text-green-500' },
        time: formatDistanceToNow(new Date(c.lastMessageAt || c.updatedAt), { addSuffix: true }),
        timestamp: c.lastMessageAt || c.updatedAt,
        status: c.status === 'human' ? 'needs_action' : 'success'
      }))
    ]
    // Sort by actual date descending
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8); // Return top 8 results

    return NextResponse.json(activityFeed);
  } catch (error) {
    console.error("Activity API Error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}