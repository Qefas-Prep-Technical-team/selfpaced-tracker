import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getRelevantKnowledge } from "@/lib/services/knowledge.service";
import {
  findOrCreateConversation,
  saveBotMessage,
  saveUserMessage,
  updateConversationName,
} from "@/lib/services/conversation.service";
import { generateAiReply } from "@/lib/services/ai.service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { sessionId, message, senderName } = body;

    if (!sessionId || !message) {
      return Response.json({ error: "Missing sessionId or message" }, { status: 400 });
    }

    const chatId = `web_${sessionId}`;
    const convo = await findOrCreateConversation(chatId);
    
    const isNameUnset = convo.name === "New Lead" || convo.name === "";
    if (isNameUnset && senderName) {
      await updateConversationName(convo, senderName);
      convo.name = senderName;
    }

    const lastMsgDate = convo.messages.length > 0 
      ? new Date(convo.lastMessageAt) 
      : new Date(0);
      
    const now = new Date();
    const isNewDay = lastMsgDate.toDateString() !== now.toDateString();

    if (convo.status === "human") {
      const minutesInactive = (now.getTime() - lastMsgDate.getTime()) / (1000 * 60);
      if (minutesInactive > 15) {
        convo.status = "bot";
      }
    }

    await saveUserMessage(convo, message);

    if (convo.status === "human") {
      return Response.json({ 
        reply: "You are currently speaking with a human agent. They will reply shortly.",
        status: "human" 
      });
    }

    const knowledgeContext = await getRelevantKnowledge(message);

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

    if (ai.reply) {
      await saveBotMessage(convo, ai.reply);
    }

    return Response.json({ 
      reply: ai.reply, 
      action: ai.action,
      flagged: ai.action === "FLAG"
    });

  } catch (error) {
    console.error("Web Chat API Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const chatId = `web_${sessionId}`;
    const convo = await findOrCreateConversation(chatId);

    return Response.json({ 
      name: convo.name,
      status: convo.status,
      messages: convo.messages 
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
