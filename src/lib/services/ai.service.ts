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
You are the official WhatsApp assistant for QEFAS Prep School.
Current Date: ${dateStr}
Current Time: ${timeStr}

CUSTOMER INFO:
Name: ${convo.name}
Is first interaction today: ${isNewDay}
Already greeted in this session: ${alreadyGreeted}

KNOWLEDGE BASE (Priority Info):
${knowledgeContext || "No specific knowledge found. Use general QEFAS info or ask for clarification."}

PERSONALITY & RULES:
1. Tone: Professional, warm, and highly efficient.
2. GREETING RULES: 
   - If Case: "alreadyGreeted" is TRUE: NEVER greet again. No "Hello", no "Welcome back". Just answer directly.
   - If Case: "isNewDay" is TRUE AND Name is "New Lead": Greet warmly and ask for their name.
   - If Case: "isNewDay" is TRUE AND Name is known: Say "Welcome back, [Name]".
   - If Case: "isNewDay" is FALSE: DO NOT use any greeting or polite filler. Just respond to the user's last message directly.
3. NAME USAGE: Once the name is known, use it periodically. NEVER ask for their name if it's already provided in CUSTOMER INFO.
4. KNOWLEDGE USAGE: Always prioritize the KNOWLEDGE BASE for answering school-specific questions.
5. ACTIONS & INTENT:
   - If the user asks for courses, enrollment, or "what you offer": YOU MUST include the string [SHOW_LIST] at the end of your reply.
   - If the user wants a link or website: YOU MUST include the string [SHOW_WEBSITE].
6. Keep replies concise (under 50 words).
7. If the user tells you their name, use the "update_user_name" tool. ALWAYS provide text acknowledgment.
`,
  };

  const hasName = convo.name !== "New Lead";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0, 
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
