/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import Pusher from "pusher";
import dbConnect from "@/lib/mongodb";
import {
  sendTelegramCourseLink,
  sendTelegramCourseList,
  sendTelegramText,
  sendTelegramWebsiteButton,
} from "@/lib/telegram";
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

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

function extractTelegramMessage(body: any) {
  if (body.callback_query) {
    const query = body.callback_query;
    return {
      from: query.message.chat.id.toString(),
      userMsg: query.data,
      selectionKey: query.data,
      senderName: query.from.first_name || ""
    };
  }

  if (body.message) {
    const msg = body.message;
    return {
      from: msg.chat.id.toString(),
      userMsg: msg.text || "",
      selectionKey: "",
      senderName: msg.from.first_name || ""
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const incoming = extractTelegramMessage(body);

    if (!incoming?.from) {
      return Response.json({ ok: true });
    }

    const { from, userMsg, selectionKey, senderName } = incoming;
    
    // We prefix telegram IDs with tg_ to separate them from whatsapp numbers
    const chatId = `tg_${from}`;

    const convo = await findOrCreateConversation(chatId);
    const channel = `chat-${convo._id.toString()}`;
    const isNameUnset = convo.name === "New Lead" || convo.name === "";
    
    if (isNameUnset && senderName) {
      await updateConversationName(convo, senderName);
      convo.name = senderName;
    }

    if (selectionKey === "open_website") {
      await sendTelegramWebsiteButton(from, convo.name);
      await saveSelectionMessage(convo, "Open Website");
      return Response.json({ ok: true });
    }

    if (COURSE_MAP[selectionKey]) {
      await sendTelegramCourseLink(from, COURSE_MAP[selectionKey], convo.name);
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

    if (convo.status === "human") {
      const minutesInactive = (now.getTime() - lastMsgDate.getTime()) / (1000 * 60);
      if (minutesInactive > 15) {
        convo.status = "bot";
      }
    }

    await saveUserMessage(convo, userMsg);

    await pusher.trigger(channel, "new-message", {
      body: userMsg,
      sender: "user",
    });
    await pusher.trigger("chat-updates", "new-message", { sender: "user", conversationId: convo._id.toString() });

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

    if (ai.action === "FLAG") {
      convo.flagged = true;
      convo.flagReason = ai.flagReason;
      convo.status = "human";
    }

    if (ai.action === "SHOW_ABOUT") {
      if (ai.reply) {
        await saveBotMessage(convo, ai.reply);
        await pusher.trigger(channel, "new-message", {
          body: ai.reply,
          sender: "bot",
        });
        await pusher.trigger("chat-updates", "new-message", { sender: "bot", conversationId: convo._id.toString() });
        
        // Import sendTelegramGeneralAbout from telegram helper
        const { sendTelegramGeneralAbout } = await import("@/lib/telegram");
        await sendTelegramGeneralAbout(from, ai.reply);
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
        await pusher.trigger("chat-updates", "new-message", { sender: "bot", conversationId: convo._id.toString() });
        await sendTelegramText(from, ai.reply);
      }

      await sendTelegramCourseList(from, convo.name);
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
        await pusher.trigger("chat-updates", "new-message", { sender: "bot", conversationId: convo._id.toString() });
        await sendTelegramText(from, ai.reply);
      }

      await sendTelegramWebsiteButton(from, convo.name);
      await updateLastInteractiveSent(convo, "SHOW_WEBSITE");
      return Response.json({ ok: true });
    }

    await saveBotMessage(convo, ai.reply);

    await pusher.trigger(channel, "new-message", {
      body: ai.reply,
      sender: "bot",
    });
    await pusher.trigger("chat-updates", "new-message", { sender: "bot", conversationId: convo._id.toString() });

    await updateLastInteractiveSent(convo, null);
    await sendTelegramText(from, ai.reply);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return Response.json(
      {
        ok: false,
        message: "Technical issue. A human will assist shortly.",
      },
      { status: 500 },
    );
  }
}
