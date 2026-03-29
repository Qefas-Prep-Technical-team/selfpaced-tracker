/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import Pusher from "pusher";
import dbConnect from "@/lib/mongodb";
import {
  sendMetaCourseLink,
  sendMetaCourseList,
  sendMetaText,
  sendMetaWebsiteButton,
  sendMetaWebsiteLink,
} from "@/lib/meta";
import { COURSE_MAP } from "@/lib/constants/whatsapp";
import { getRelevantKnowledge } from "@/lib/services/knowledge.service";
import {
  findOrCreateConversation,
  saveBotMessage,
  saveSelectionMessage,
  saveUserMessage,
  updateConversationName,
  updateLastInteractiveSent,
} from "@/lib/services/conversation.service";
import { generateAiReply } from "@/lib/services/ai.service";

export const runtime = "nodejs";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

function extractIncomingMessage(body: any) {
  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return null;
  }

  const from = message?.from || "";
  const text = message?.text?.body || "";
  const interactiveId =
    message?.interactive?.list_reply?.id ||
    message?.interactive?.button_reply?.id ||
    "";

  const interactiveTitle =
    message?.interactive?.list_reply?.title ||
    message?.interactive?.button_reply?.title ||
    "";

  return {
    from,
    userMsg: text || interactiveTitle,
    selectionKey: interactiveId || text,
    message,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verification failed", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const incoming = extractIncomingMessage(body);

    if (!incoming?.from) {
      return Response.json({ ok: true });
    }

    const { from, userMsg, selectionKey } = incoming;

    const convo = await findOrCreateConversation(from);
    const channel = `chat-${convo._id.toString()}`;
    const isNameUnset = convo.name === "New Lead";

    if (selectionKey === "open_website") {
      await sendMetaWebsiteLink(from);
      await saveSelectionMessage(convo, "Open Website");
      return Response.json({ ok: true });
    }

    if (COURSE_MAP[selectionKey]) {
      await sendMetaCourseLink(from, COURSE_MAP[selectionKey], convo.name);
      await saveSelectionMessage(convo, userMsg || selectionKey);
      await updateLastInteractiveSent(convo, selectionKey);
      return Response.json({ ok: true });
    }

    if (!userMsg) {
      return Response.json({ ok: true });
    }

    const lastMsgDate = convo.messages.length > 0 
      ? new Date(convo.lastMessageAt) 
      : new Date(0); // If no messages, treat as a new day/session
      
    const now = new Date();
    const isNewDay = lastMsgDate.toDateString() !== now.toDateString();

    await saveUserMessage(convo, userMsg);

    await pusher.trigger(channel, "new-message", {
      body: userMsg,
      sender: "user",
    });

    if (convo.status === "human") {
      return Response.json({ ok: true });
    }

    const knowledgeContext = await getRelevantKnowledge(userMsg);

    const ai = await generateAiReply({
      convo,
      knowledgeContext,
      isNewDay
    });

    if (ai.newName && isNameUnset) {
      await updateConversationName(convo, ai.newName);
    }

    if (ai.action && convo?.lastButtonSent === ai.action) {
      if (ai.reply) {
        await saveBotMessage(convo, ai.reply);
        await pusher.trigger(channel, "new-message", {
          body: ai.reply,
          sender: "bot",
        });
        await sendMetaText(from, ai.reply);
      }

      return Response.json({ ok: true });
    }

    if (ai.action === "SHOW_LIST") {
      if (ai.reply) {
        await saveBotMessage(convo, ai.reply);
        await pusher.trigger(channel, "new-message", {
          body: ai.reply,
          sender: "bot",
        });
        await sendMetaText(from, ai.reply);
      }

      await sendMetaCourseList(from, convo.name);
      await updateLastInteractiveSent(convo, "SHOW_LIST");
      return Response.json({ ok: true });
    }

    if (ai.action === "SHOW_WEBSITE") {
      if (ai.reply) {
        await saveBotMessage(convo, ai.reply);
        await pusher.trigger(channel, "new-message", {
          body: ai.reply,
          sender: "bot",
        });
        await sendMetaText(from, ai.reply);
      }

      await sendMetaWebsiteButton(from, convo.name);
      await updateLastInteractiveSent(convo, "SHOW_WEBSITE");
      return Response.json({ ok: true });
    }

    await saveBotMessage(convo, ai.reply);

    await pusher.trigger(channel, "new-message", {
      body: ai.reply,
      sender: "bot",
    });

    await updateLastInteractiveSent(convo, null);
    await sendMetaText(from, ai.reply);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Meta Webhook Error:", error);
    return Response.json(
      {
        ok: false,
        message: "Technical issue. A human will assist shortly.",
      },
      { status: 500 },
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("META WEBHOOK BODY:", JSON.stringify(body, null, 2));

//     const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
//     const from = message?.from;

//     if (from) {
//       await sendMetaText(from, "Webhook received successfully.");
//     }

//     return Response.json({ ok: true });
//   } catch (error) {
//     console.error("Meta Webhook Error:", error);
//     return Response.json({ ok: false }, { status: 500 });
//   }
// }
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("META WEBHOOK BODY:", JSON.stringify(body, null, 2));

//     const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
//     const from = message?.from;

//     if (from) {
//       await sendMetaText(from, "Webhook received successfully.");
//     }

//     return Response.json({ ok: true });
//   } catch (error) {
//     console.error("Meta Webhook Error:", error);
//     return Response.json({ ok: false }, { status: 500 });
//   }
// }
