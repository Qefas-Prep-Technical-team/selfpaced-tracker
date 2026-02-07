/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import twilio from "twilio";
import Pusher from "pusher";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Knowledge from "@/models/Knowledge";

export const runtime = "nodejs";

/* -------------------- Clients -------------------- */
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/* -------------------- Configuration -------------------- */
const COURSE_MAP: Record<string, string> = {
  course_jss1: "jss1-course-self-paced-class-promo/",
  course_jss2: "jss2-course-self-paced-class-promo/",
  course_jss3: "jss3-course-self-paced-class-promo/",
  course_sss1: "sss1-course-self-paced-class-promo/",
  course_sss2: "sss2-course-self-paced-class-promo/",
  course_sss3: "sss3-course-self-paced-class-promo/",
};

const BUTTON_MAP: Record<string, string> = {
  "[SHOW_LIST]": "HX88472bd867abd715b9b9723532f7859b",
  "[SHOW_WEBSITE]": "HX88cea60a0722911d2aa32a399baccf5b",
  course_jss1: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
  course_jss2: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
  course_jss3: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
  course_sss1: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
  course_sss2: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
  course_sss3: "HXc875c0b83b3ced9f6a9b772f3dcc5c66",
};

/* -------------------- Utils -------------------- */
function cosineSimilarity(a: number[], b: number[]) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0,
    magA = 0,
    magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB)) || 0;
}

async function getRelevantKnowledge(userMsg: string) {
  try {
    // Search for documents where category, question, or tags match the user's words
    const keywords = userMsg.split(" ").filter((word) => word.length > 3);
    const query = {
      $or: [
        { category: { $regex: userMsg, $options: "i" } },
        { question: { $regex: userMsg, $options: "i" } },
        { tags: { $in: keywords.map((k) => new RegExp(k, "i")) } },
      ],
    };

    const matches = await Knowledge.find(query).limit(3);
    return matches.map((k) => `- ${k.answer}`).join("\n");
  } catch (err) {
    return "";
  }
}
/* -------------------- Webhook -------------------- */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const rawFrom = formData.get("From")?.toString() || "";
    const from = rawFrom.replace("whatsapp:", "").trim();
    const to = formData.get("To")?.toString() || "";
    const userMsg = formData.get("Body")?.toString() || "";
    const listItemId = formData.get("ListId")?.toString();

    if (!from || !userMsg) {
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    /* -------------------- Session -------------------- */
    let convo = await Conversation.findOne({ phoneNumber: from });

    if (!convo) {
      convo = await Conversation.create({
        phoneNumber: from,
        name: "New Lead",
        messages: [],
        status: "bot",
        lastMessageAt: new Date(),
      });
    }
    const isNameUnset = convo.name === "New Lead";

    /* -------------------- Direct Course Selection -------------------- */
    const selectionKey = listItemId || userMsg;

    if (COURSE_MAP[selectionKey]) {
      await twilioClient.messages.create({
        from: to,
        to: rawFrom,
        contentSid: BUTTON_MAP[selectionKey],
        contentVariables: JSON.stringify({
          "1": convo.name,
          "2": COURSE_MAP[selectionKey],
        }),
      });

      convo.messages.push({
        body: `User selected: ${userMsg}`,
        sender: "user",
        timestamp: new Date(),
      });

      await convo.save();

      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    /* -------------------- Save User Message -------------------- */
    convo.messages.push({
      body: userMsg,
      sender: "user",
      timestamp: new Date(),
    });

    await convo.save();

    const channel = `chat-${convo._id.toString()}`;
    await pusher.trigger(channel, "new-message", {
      body: userMsg,
      sender: "user",
    });

    if (convo.status === "human") {
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    /* -------------------- AI Context -------------------- */
    const knowledgeContext = await getRelevantKnowledge(userMsg);

    const history: ChatCompletionMessageParam[] = convo.messages
      .slice(-8)
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.body,
      })) as ChatCompletionMessageParam[];

    const systemPrompt = {
      role: "system" as const,
      content: `
You are the official WhatsApp assistant for QEFAS Prep School.
Customer Name: ${convo.name}

KNOWLEDGE BASE:
${knowledgeContext || "General QEFAS information."}

RULES:
1. If name is "New Lead", ask for their name.
2. Address users by name once known.
3. Use [SHOW_LIST] to show courses.
4. Use [SHOW_WEBSITE] for the website.
5. Keep replies under 60 words.
6.When the user shows intent to enroll, buy, register, or start classes:
- Respond with a short confirmation message
- THEN include [SHOW_LIST] exactly once.
7. If Customer Name is NOT "New Lead", NEVER ask for the user's name again.


      `,
    };

    /* -------------------- AI Call -------------------- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [systemPrompt, ...history],
      tools: [
        {
          type: "function",
          function: {
            name: "update_user_name",
            description: "Updates the student's name",
            parameters: {
              type: "object",
              properties: {
                newName: { type: "string" },
              },
              required: ["newName"],
            },
          },
        },
      ],
    });

    const choice = completion.choices[0].message;

    /* -------------------- Tool Handling (FIXED) -------------------- */
    // if (choice.tool_calls?.length) {
    //   for (const toolCall of choice.tool_calls) {
    //     if (toolCall.type === "function" && toolCall.function.name === "update_user_name") {
    //       const args = JSON.parse(toolCall.function.arguments);

    //       if (args.newName) {
    //         convo.name = args.newName;
    //         await convo.save();

    //         const secondPass = await openai.chat.completions.create({
    //           model: "gpt-4o-mini",
    //           messages: [
    //             systemPrompt,
    //             ...history,
    //             choice,
    //             {
    //               role: "tool",
    //               tool_call_id: toolCall.id,
    //               content: `Name updated to ${args.newName}`,
    //             },
    //           ],
    //         });

    //         choice = secondPass.choices[0].message;
    //       }
    //     }
    //   }
    // }
    if (choice.tool_calls?.length && isNameUnset) {
      for (const toolCall of choice.tool_calls) {
        if (
          toolCall.type === "function" &&
          toolCall.function.name === "update_user_name"
        ) {
          const args = JSON.parse(toolCall.function.arguments);

          if (args.newName && convo.name === "New Lead") {
            convo.name = args.newName.trim();
            await convo.save();

            // 👇 IMPORTANT: reply directly, DO NOT re-run onboarding
            const aiReply = `Nice to meet you, ${convo.name}! 😊 How can I help you today?`;

            convo.messages.push({
              body: aiReply,
              sender: "bot",
              timestamp: new Date(),
            });

            await convo.save();

            await pusher.trigger(`chat-${convo._id}`, "new-message", {
              body: aiReply,
              sender: "bot",
            });

            const twiml = new twilio.twiml.MessagingResponse();
            twiml.message(aiReply);

            return new Response(twiml.toString(), {
              headers: { "Content-Type": "text/xml" },
            });
          }
        }
      }
    }

    const aiReply = choice.content || "How else can I help you today?";

    /* -------------------- Button Interception -------------------- */
    for (const key of Object.keys(BUTTON_MAP)) {
      if (aiReply.includes(key)) {
        await twilioClient.messages.create({
          from: to,
          to: rawFrom,
          contentSid: BUTTON_MAP[key],
          contentVariables: JSON.stringify({ "1": convo.name }),
        });

        convo.messages.push({
          body: aiReply,
          sender: "bot",
          timestamp: new Date(),
        });

        await convo.save();

        return new Response("<Response></Response>", {
          headers: { "Content-Type": "text/xml" },
        });
      }
    }

    /* -------------------- Final Message -------------------- */
    convo.messages.push({
      body: aiReply,
      sender: "bot",
      timestamp: new Date(),
    });

    await convo.save();

    await pusher.trigger(channel, "new-message", {
      body: aiReply,
      sender: "bot",
    });

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiReply);

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return new Response(
      "<Response><Message>Technical issue. A human will assist shortly.</Message></Response>",
      { headers: { "Content-Type": "text/xml" } },
    );
  }
}
