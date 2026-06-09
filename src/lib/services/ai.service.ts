/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type AiResult = {
  reply: string;
  action: "SHOW_LIST" | "SHOW_WEBSITE" | null;
  newName: string | null;
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
You are the official WhatsApp support representative for QEFAS Prep School. Your goal is to guide prospective students and parents, answer questions naturally and professionally, and build a warm, helpful connection.

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
   - If the KNOWLEDGE BASE does not contain the answer to a specific question, do NOT hallucinate or make up details. Politely say: "I don't have that specific detail on hand, but I will flag this for our administrative team so they can follow up with you directly. 😊"
4. Actions & Button Triggers:
   - If the user shows interest in enrolling, registration, class offerings, or asks "what courses do you offer", include the tag [SHOW_LIST] at the very end of your response.
   - If the user asks for the website, online portal, or links, include the tag [SHOW_WEBSITE] at the very end of your response.
5. Conciseness: Keep your response engaging, helpful, and concise (between 25 and 75 words).
`,
  };

  const hasName = convo.name !== "New Lead";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2, // Low temperature for consistency, but slightly above 0 for more natural speech variation
    messages: [systemPrompt, ...history],
    tools: hasName ? undefined : [
      {
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
      },
    ],
    tool_choice: hasName ? undefined : "auto",
  });

  const choice = completion.choices[0].message;

  let newName: string | null = null;

  if (choice.tool_calls?.length && !hasName) {
    for (const toolCall of choice.tool_calls) {
      if (
        toolCall.type === "function" &&
        toolCall.function.name === "update_user_name"
      ) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          if (args?.newName) {
            newName = args.newName.trim();
          }
        } catch (error) {
          console.error("Failed to parse tool arguments:", error);
        }
      }
    }
  }

  const rawReply = choice.content || "I understand. Is there anything else you'd like to know about our courses or school?";

  let action: "SHOW_LIST" | "SHOW_WEBSITE" | null = null;

  if (rawReply.includes("[SHOW_LIST]")) {
    action = "SHOW_LIST";
  } else if (rawReply.includes("[SHOW_WEBSITE]")) {
    action = "SHOW_WEBSITE";
  }

  const reply = rawReply
    .replace("[SHOW_LIST]", "")
    .replace("[SHOW_WEBSITE]", "")
    .trim();

  return {
    reply,
    action,
    newName,
  };
}
