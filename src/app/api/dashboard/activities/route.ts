/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Conversation from "@/models/Conversation";
import Newsletter from "@/models/Newsletter";
import Activity from "@/models/Activity"; // New model for deletion logs
import { formatDistanceToNow } from "date-fns";

export async function GET() {
  try {
    await dbConnect();

    // Fetch records from all collections + the new Activity (deletions) collection
    const [inquiries, newsletters, conversations, deletions] =
      await Promise.all([
        Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
        Newsletter.find().sort({ subscribedAt: -1 }).limit(5).lean(),
        Conversation.find().sort({ lastMessageAt: -1 }).limit(5).lean(),
        Activity.find({ status: "deleted" })
          .sort({ timestamp: -1 })
          .limit(5)
          .lean(),
      ]);

    // Format all sources into a single activity interface
    const activityFeed = [
      ...newsletters.map((n: any) => ({
        event: "New Subscription",
        user: n.email.split("@")[0],
        channel: { icon: "alternate_email", name: "Email" },
        time: formatDistanceToNow(new Date(n.subscribedAt), {
          addSuffix: true,
        }),
        timestamp: n.subscribedAt,
        status: "success",
      })),
      ...inquiries.map((i: any) => ({
        event: "New Inquiry",
        user: i.parentName,
        channel: { icon: "ads_click", name: i.channelName },
        time: formatDistanceToNow(new Date(i.createdAt), { addSuffix: true }),
        timestamp: i.createdAt,
        status: "info",
      })),
      ...conversations.map((c: any) => ({
        event: "AI Chat Handoff",
        user: c.name || "WhatsApp User",
        channel: { icon: "chat", name: "WhatsApp", color: "text-green-500" },
        time: formatDistanceToNow(new Date(c.lastMessageAt || c.updatedAt), {
          addSuffix: true,
        }),
        timestamp: c.lastMessageAt || c.updatedAt,
        status: c.status === "human" ? "needs_action" : "success",
      })),
      // NEW: Mapping for deletions that includes Admin Name and Item Name
      /* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/activity/route.ts

...deletions.map((d: any) => ({
  // 1. Set the Admin Email as the primary "user"
  user: d.adminEmail || 'admin@analytics.com.ng', 
  
  // 2. Clearly state what happened in the event name
  event: 'Record Deleted', 
  
  // 3. Put the deleted item's name in the channel description
  channel: { 
    icon: 'delete_forever', 
    name: `Removed: ${d.user}`, // This is the 'test-parent5@example.com'
    color: 'text-red-500' 
  },
  
  time: formatDistanceToNow(new Date(d.timestamp), { addSuffix: true }),
  timestamp: d.timestamp,
  
  // 4. FIX: Change 'failed' to 'deleted' or 'info' 
  // If your UI component shows "Failed" for 'failed', use 'deleted' or a custom string
  status: 'deleted' 
})),
    ]
      // Sort everything by actual date descending
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10); // Expanded slightly to 10 to accommodate more types

    return NextResponse.json(activityFeed);
  } catch (error) {
    console.error("Activity API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}
