/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { formatDistanceToNow } from "date-fns";

export async function GET() {
  try {
    await dbConnect();

    const leads = await Conversation.find()
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    const formattedLeads = leads.map((lead: any) => {
      const lastMsg = lead.messages[lead.messages.length - 1];
      
      return {
        id: lead._id.toString(),
        name: lead.name,
        // Default avatar or generated from initials
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`,
        status: 'online', // In a real app, track this with socket.io/pusher
        lastMessage: lastMsg?.body || 'No messages yet',
        lastSeen: formatDistanceToNow(new Date(lead.lastMessageAt), { addSuffix: false }),
        mode: lead.status, // 'bot' maps to your 'ai' UI mode
        tags: [
          { 
            label: lead.status === 'bot' ? 'AI Active' : 'Manual', 
            color: lead.status === 'bot' ? 'purple' : 'gray' 
          },
          ...(lead.isSubscribedToNewsletter ? [{ label: 'Subscriber', color: 'green' }] : [])
        ]
      };
    });

    return NextResponse.json(formattedLeads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}