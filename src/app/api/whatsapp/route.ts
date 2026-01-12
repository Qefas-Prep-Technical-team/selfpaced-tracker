import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import Pusher from "pusher";
import OpenAI from "openai"; // 1. Swapped import

import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export const runtime = "nodejs";

/* -----------------------------------
   Initialize services
----------------------------------- */
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// 2. Initialize OpenAI instead of Google AI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    /* -----------------------------------
       1. Parse Twilio Webhook
    ----------------------------------- */
    const formData = await req.formData();
    const userMsg = formData.get("Body")?.toString() || "";
    const from = formData.get("From")?.toString() || "";

    if (!userMsg || !from) {
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    /* -----------------------------------
       2. Find or Create Conversation
    ----------------------------------- */
    let convo = await Conversation.findOne({ phoneNumber: from });

    if (!convo) {
      convo = await Conversation.create({
        phoneNumber: from,
        messages: [],
        status: "bot",
        lastMessageAt: new Date(),
      });
    }

    /* -----------------------------------
       3. Save User Message
    ----------------------------------- */
    convo.messages.push({
      body: userMsg,
      sender: "user",
      timestamp: new Date(),
    });

    convo.lastMessageAt = new Date();
    await convo.save();

    /* -----------------------------------
       4. Realtime Update (Dashboard)
    ----------------------------------- */
    await pusher.trigger("chat-channel", "incoming-message", {
      phoneNumber: from,
      body: userMsg,
      sender: "user",
      status: convo.status,
    });

    /* -----------------------------------
       5. Stop AI if Human Took Over
    ----------------------------------- */
    if (convo.status === "human") {
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    /* -----------------------------------
       6. OpenAI Chat Completion
    ----------------------------------- */
    // Using gpt-4o-mini for fast, high-quality school support
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Official AI Assistant for QEFAS Prep School (Quality Education For All Students). 
          Your goal is to convert parent inquiries into enrollments.
          
          CONTEXT:
          - Solution: High-quality instructors (MSc/PhD) + tech for affordability.
          - Infrastructure: Akowonjo, Lagos campus, 24/7 Solar Power, ICT lab, private security.
          - Offerings: 
             * Secondary (JSS/SSS): ₦1,500/12 weeks.
             * Local Exams (UTME, GCE, SSCE): ₦5,000 - ₦6,000.
             * International: SAT, GRE, IELTS, TOEFL, USA Admission Consultancy.
          - Learning Modes: In-Person, Live-Online, and Self-Paced.

          GUIDELINES:
          1. Highlight that lessons are handled by MSc/PhD holders.
          2. Mention the 24/7 Solar-powered environment.
          3. Use bullet points for course features.
          4. Keep replies to 3-4 sentences.
          5. If asked about USA Admission or technical errors, say: "A human counselor will join this chat shortly to assist you further."`
        },
        {
          role: "user",
          content: userMsg
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiReply = response.choices[0].message.content || "I'm sorry, I couldn't process that. A human agent will assist you shortly.";

    /* -----------------------------------
       7. Save AI Reply
    ----------------------------------- */
    convo.messages.push({
      body: aiReply,
      sender: "bot",
      timestamp: new Date(),
    });

    convo.lastMessageAt = new Date();
    await convo.save();

    /* -----------------------------------
       8. Reply to WhatsApp (TwiML)
    ----------------------------------- */
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiReply);

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}