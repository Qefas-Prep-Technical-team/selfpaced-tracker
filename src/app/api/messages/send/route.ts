/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Pusher from "pusher";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { sendMetaText } from "@/lib/meta";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { conversationId, body } = await req.json();
    await dbConnect();

    const convo = await Conversation.findById(conversationId);
    if (!convo) {
      return NextResponse.json({ error: "No convo" }, { status: 404 });
    }

    await sendMetaText(convo.phoneNumber, body);

    const humanMessage = {
      body,
      sender: "human",
      timestamp: new Date(),
    };

    convo.messages.push(humanMessage as any);
    convo.status = "human";
    convo.lastMessageAt = new Date();
    await convo.save();

    await pusher.trigger(`chat-${conversationId}`, "new-message", humanMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
