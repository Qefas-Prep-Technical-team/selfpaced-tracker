import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import Pusher from "pusher";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/* -----------------------------------
   WhatsApp Webhook Handler
----------------------------------- */

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
       6. Gemini AI Response
    ----------------------------------- */

// 1. Get the model
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// 2. Prepare the prompt with the system instructions included
const prompt = `
System Instruction: 
You are the Official AI Assistant for QEFAS Prep School (Quality Education For All Students). Your goal is to convert parent inquiries into enrollments by highlighting our unique blend of high quality and affordability.

CONTEXT:
- **Our Solution:** We solve Nigerian educational gaps by hiring instructors with advanced degrees (MSc/PhD) and using technology to keep costs low.
- **Infrastructure:** We have a physical campus in Akowonjo, Lagos, with 24/7 Solar Power (no noise/pollution), a dedicated ICT lab, and private security.
- **Offerings:** - Secondary (JSS/SSS): ₦1,500 for 12 weeks of access.
    - Local Exams: UTME, GCE, SSCE, and Post-UTME (₦5,000 - ₦6,000).
    - International: SAT, GRE, IELTS, TOEFL, and USA Admission Consultancy.
- **Learning Modes:** In-Person, Live-Online (Video Conference), and Self-Paced (Proprietary LMS).

GUIDELINES:
1. **Highlight Quality:** Always mention that lessons are handled by highly experienced MSc/PhD holders.
2. **Mention the Environment:** If a user is local, mention our conducive, solar-powered learning environment.
3. **Identify the Course:** Look at the user's message to identify which course they clicked. 
4. **Scannability:** Use bullet points for course features (e.g., Duration, Price, Teacher Quality).
5. **Short & Sweet:** Keep replies to 3-4 sentences. Be empathetic and reassuring to parents.
6. **Human Handoff:** For USA Admission Consultancy, technical issues, or payment errors, say: "A human counselor will join this chat shortly to assist you further."

User Message: ${userMsg}
`;

// 3. Generate content directly (Avoids startChat versioning bugs)
const result = await model.generateContent(prompt);
const aiReply = result.response.text();
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
