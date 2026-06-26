/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type AiResult = {
  reply: string;
  action: "SHOW_LIST" | "SHOW_WEBSITE" | "SHOW_ABOUT" | "FLAG" | null;
  newName: string | null;
  flagReason: string | null;
};

export async function generateAiReply(params: {
  convo: any;
  knowledgeContext: string;
  isNewDay: boolean;
  alreadyGreeted?: boolean;
}): Promise<AiResult> {
  const { convo, knowledgeContext, isNewDay } = params;

  const history: ChatCompletionMessageParam[] = convo.messages
    .slice(-10)
    .map((m: any) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.body,
    })) as ChatCompletionMessageParam[];

  const lastAssistantMsg = [...history].reverse().find(m => m.role === 'assistant');
  const lastContent = typeof lastAssistantMsg?.content === 'string' ? lastAssistantMsg.content.toLowerCase() : "";
  const alreadyGreeted = lastContent.includes("hello") || lastContent.includes("welcome") || lastContent.includes("good morning") || lastContent.includes("good afternoon");

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: `
You are the official support representative for QEFAS Prep School. Your goal is to guide prospective students and parents, answer questions naturally and professionally, and build a warm, helpful connection.

Current Date: ${dateStr}
Current Time: ${timeStr}

CUSTOMER INFO:
Name: ${convo.name}
Is first interaction today: ${isNewDay}
Already greeted in this session: ${alreadyGreeted}

KNOWLEDGE BASE (Priority Reference):
${knowledgeContext || "No specific matching documents found in the school's local database. Answer generally about QEFAS Prep School if possible, or politely explain that you will check with an administrator."}

PERSONALITY & HUMAN CONVERSATION GUIDELINES:
1. Tone: Professional, warm, engaging, and human-like. Use natural emojis occasionally (e.g. 😊, 📚, ✨).
2. Conversation Flow:
   - Avoid robotic and mechanical greetings. If you have already greeted the user or if they are in an active conversation, do not repeat "Welcome back!" or "Hello!" in every message. Just flow naturally into the answer.
   - If the customer's name is "New Lead", politely introduce yourself and ask for their name in a friendly, natural way (e.g. "May I know your name so I know who I am speaking with?").
   - If the user provides their name, use the "update_user_name" tool.
3. Accurate & Confident Responses:
   - Rely strictly on the KNOWLEDGE BASE for answering school-specific policy questions (fees, schedules, class structures, registrations).
   - If the KNOWLEDGE BASE does not contain the answer to a specific question, do NOT hallucinate or make up details. Politely say: "I don't have that specific detail on hand, but I will flag this for our administrative team so they can follow up with you directly. 😊" AND immediately call the "flag_for_human" tool with the user's issue.
4. CRITICAL RULES FOR MENUS AND LINKS (DO NOT IGNORE):
   - You CANNOT send course links manually or register students yourself. You do NOT need their details.
   - Any time a user shows interest in enrolling, asks for a course link, says "yes" to enrolling, or mentions a specific class (like JSS2), you MUST append the exact tag [SHOW_LIST] at the very end of your response. This triggers the system to send them the interactive course menu so they can register automatically.
   - Example response: "Great! Please select your course from the menu below to get the official enrollment link. [SHOW_LIST]"
   - If the user asks for the website, online portal, or links to the homepage, include the tag [SHOW_WEBSITE] at the very end of your response.
   - If the user asks about Qefas Prep school in general (who you are, what you do), include the tag [SHOW_ABOUT] at the very end of your response to attach our beautiful promotional banner.
5. Conciseness: Keep your response engaging, helpful, and concise (between 25 and 75 words).
`,
  };

  const hasName = convo.name !== "New Lead";
  const tools: any[] = [
    {
      type: "function",
      function: {
        name: "flag_for_human",
        description: "Flags the conversation for human administrative review. Call this when you don't know the answer to a question, or the user explicitly asks for human help.",
        parameters: {
          type: "object",
          properties: {
            reason: { type: "string", description: "The user's issue or question that needs human attention." },
          },
          required: ["reason"],
        },
      },
    },
  ];

  if (!hasName) {
    tools.push({
      type: "function",
      function: {
        name: "update_user_name",
        description: "Updates the student's name if they provide it",
        parameters: {
          type: "object",
          properties: {
            newName: { type: "string" },
          },
          required: ["newName"],
        },
      },
    });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [systemPrompt, ...history],
    tools,
    tool_choice: "auto",
  });

  const choice = completion.choices[0].message;

  let newName: string | null = null;
  let flagReason: string | null = null;

  if (choice.tool_calls?.length) {
    for (const toolCall of choice.tool_calls) {
      if (toolCall.type === "function") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          if (toolCall.function.name === "update_user_name" && args?.newName && !hasName) {
            newName = args.newName.trim();
          } else if (toolCall.function.name === "flag_for_human" && args?.reason) {
            flagReason = args.reason.trim();
          }
        } catch (error) {
          console.error("Failed to parse tool arguments:", error);
        }
      }
    }
  }

  const rawReply = choice.content || "I understand. I will flag this for our administrative team so they can assist you further.";

  let action: "SHOW_LIST" | "SHOW_WEBSITE" | "SHOW_ABOUT" | "FLAG" | null = flagReason ? "FLAG" : null;

  if (rawReply.includes("[SHOW_LIST]")) {
    action = "SHOW_LIST";
  } else if (rawReply.includes("[SHOW_WEBSITE]")) {
    action = "SHOW_WEBSITE";
  } else if (rawReply.includes("[SHOW_ABOUT]")) {
    action = "SHOW_ABOUT";
  }

  const reply = rawReply
    .replace(/\[SHOW_LIST\]/g, "")
    .replace(/\[SHOW_WEBSITE\]/g, "")
    .replace(/\[SHOW_ABOUT\]/g, "")
    .trim();

  return {
    reply,
    action,
    newName,
    flagReason,
  };
}
