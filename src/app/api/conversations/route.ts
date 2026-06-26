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
        status: "online", // In a real app, track this with socket.io/pusher
        lastMessage: lastMsg?.body || "No messages yet",
        lastSeen: formatDistanceToNow(new Date(lead.lastMessageAt), {
          addSuffix: false,
        }),
        mode: lead.status, // 'bot' maps to your 'ai' UI mode
        tags: [
          {
            label: lead.status === "bot" ? "AI Active" : "Manual",
            color: lead.status === "bot" ? "purple" : "gray",
          },
          ...(lead.isSubscribedToNewsletter
            ? [{ label: "Subscriber", color: "green" }]
            : []),
        ],
        flagged: lead.flagged || false,
        flagReason: lead.flagReason || null,
      };
    });

    return NextResponse.json(formattedLeads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { phoneNumber, name, email } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if conversation already exists
    let convo = await Conversation.findOne({ phoneNumber });
    if (convo) {
      return NextResponse.json({ 
        id: convo._id.toString(), 
        name: convo.name,
        email: convo.email,
        status: "online",
        lastMessage: convo.messages[convo.messages.length - 1]?.body || "No messages yet",
        lastSeen: "Just now",
        isNew: false
      });
    }

    // Create a new conversation
    convo = await Conversation.create({
      phoneNumber,
      name: name || "New Lead",
      email: email || "",
      status: "human",
      messages: [],
      lastMessageAt: new Date(),
      isSubscribedToNewsletter: false
    });

    return NextResponse.json({
      id: convo._id.toString(),
      name: convo.name,
      email: convo.email,
      status: "online",
      lastMessage: "No messages yet",
      lastSeen: "Just now",
      isNew: true
    }, { status: 201 });
  } catch (error) {
    console.error("POST conversation failed:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
