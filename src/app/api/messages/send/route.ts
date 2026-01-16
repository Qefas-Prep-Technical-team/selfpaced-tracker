/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import twilio from "twilio";
import Pusher from "pusher"; // Import Pusher
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    const { conversationId, body } = await req.json();
    await dbConnect();

    const convo = await Conversation.findById(conversationId);
    if (!convo) return NextResponse.json({ error: "No convo" }, { status: 404 });

    // 1. Send via Twilio to the parent's phone
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: convo.phoneNumber,
      body: body
    });

    // 2. Prepare the message object
    const humanMessage = {
      body,
      sender: 'human',
      timestamp: new Date()
    };

    // 3. Save to MongoDB
    convo.messages.push(humanMessage as any);
    await convo.save();

    // 4. TRIGGER PUSHER (This makes it show up in your window!)
    await pusher.trigger(`chat-${conversationId}`, "new-message", humanMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}