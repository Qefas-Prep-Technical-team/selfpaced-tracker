/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import Pusher from "pusher";
import OpenAI from "openai";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export const runtime = "nodejs";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* 1. Parse Twilio Webhook */
    const formData = await req.formData();
    const userMsg = formData.get("Body")?.toString() || "";
    const from = formData.get("From")?.toString() || "";

    if (!userMsg || !from) {
      return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    /* 2. Find or Create Conversation */
    let convo = await Conversation.findOne({ phoneNumber: from });

    if (!convo) {
      convo = await Conversation.create({
        phoneNumber: from,
        name: 'New Lead',
        messages: [],
        status: "bot",
        lastMessageAt: new Date(),
      });

      // Notify Activity Feed of NEW conversation
      await pusher.trigger("dashboard-updates", "new-activity", {
        event: 'New WhatsApp Lead',
        user: from.replace('whatsapp:', ''),
        channel: { icon: 'chat', name: 'WhatsApp', color: 'text-green-500' },
        time: 'Just now',
        status: 'needs_action'
      });
    }

    /* 3. Save User Message & Trigger Real-time */
    const userMessageObj = {
      body: userMsg,
      sender: "user",
      timestamp: new Date(),
    };

    convo.messages.push(userMessageObj as any);
    convo.lastMessageAt = new Date();
    await convo.save();

    // Trigger UI update for the USER message
    const channelName = `chat-${convo._id.toString()}`;
    await pusher.trigger(channelName, "new-message", userMessageObj);
    
    // Update the sidebar list
    await pusher.trigger("chat-updates", "new-message", {
      conversationId: convo._id.toString(),
      body: userMsg,
      sender: "user"
    });

    /* 4. Stop AI if Human Took Over */
    if (convo.status === "human") {
      return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    /* 5. OpenAI Chat Completion */
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Official AI Assistant for QEFAS Prep School... (rest of your prompt)`
        },
        { role: "user", content: userMsg }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiReply = response.choices[0].message.content || "A counselor will assist you shortly.";

    /* 6. Save AI Reply & Trigger Real-time */
    const aiMessageObj = {
      body: aiReply,
      sender: "bot",
      timestamp: new Date(),
    };

    convo.messages.push(aiMessageObj as any);
    await convo.save();

    // Trigger UI update for the AI reply
    await pusher.trigger(channelName, "new-message", aiMessageObj);

    /* 7. Reply to WhatsApp */
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiReply);

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}