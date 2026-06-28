/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type AiResult = {
  reply: string;
  action: "SHOW_LIST" | "SHOW_WEBSITE" | "SHOW_ABOUT" | "SHOW_HUB_ABOUT" | "FLAG" | null;
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
You are the official support representative for both QEFAS Prep School and Qefas Hub. 
Your goal is to guide prospective students/parents for the prep school, and assist school administrators or users interested in the Qefas Hub SaaS platform. Answer questions naturally, professionally, and adapt your tone based on the user's inquiry.

Current Date: ${dateStr}
Current Time: ${timeStr}

CUSTOMER INFO:
Name: ${convo.name}
Is first interaction today: ${isNewDay}
Already greeted in this session: ${alreadyGreeted}

KNOWLEDGE BASE (Priority Reference):
${knowledgeContext || "No specific matching documents found in the database."}

AVAILABLE COURSES AT QEFAS PREP:
We offer self-paced online classes for the following levels:
- JSS 1 (Junior Secondary 1)
- JSS 2 (Junior Secondary 2)
- JSS 3 (Junior Secondary 3)
- SSS 1 (Senior Secondary 1)
- SSS 2 (Senior Secondary 2)
- SSS 3 (Senior Secondary 3)
If a user asks about what courses, classes, or levels are available, use this list.

PLATFORM DISTINCTION (Qefas vs Qefas Hub):
- "Qefas" refers to the preparatory school offering self-paced online video classes.
- "Qefas Hub" refers to our B2B SaaS platform (Educational Management System) built for other schools.
If a user is asking about subscriptions, admin dashboards, or school management, they are asking about Qefas Hub. 

PERSONALITY & HUMAN CONVERSATION GUIDELINES:
1. Tone: Professional, warm, engaging, and human-like. Use natural emojis occasionally (e.g. 😊, 📚, ✨).
2. Conversation Flow:
   - Avoid robotic and mechanical greetings. If you have already greeted the user, do not repeat "Welcome back!" or "Hello!". Just flow naturally into the answer.
   - If the customer's name is "New Lead", politely introduce yourself and ask for their name in a friendly, natural way (e.g. "May I know your name so I know who I am speaking with?").
   - If the user provides their name, use the "update_user_name" tool.
3. Accurate & Confident Responses:
   - Rely strictly on the KNOWLEDGE BASE for answering policy questions (fees, schedules, platform features).
   - If the KNOWLEDGE BASE does not contain the answer, do NOT hallucinate or make up details. Politely say: "I don't have that specific detail on hand, but I will flag this for our administrative team so they can follow up with you directly. 😊" AND immediately call the "flag_for_human" tool.
4. CRITICAL RULES FOR MENUS AND LINKS (DO NOT IGNORE):
   - You DO NOT need to list all available courses manually. The system has an interactive menu for this.
   - You CANNOT send course links manually or register students into PREP CLASSES yourself.
   - For Qefas Prep School inquiries: Any time a user asks for available courses, shows interest in enrolling, asks for a course link, or mentions a specific class (like JSS2), you MUST append the exact tag [SHOW_LIST] at the very end of your response.
   - Example response: "We offer several self-paced classes! Please select a course from the menu below to learn more. [SHOW_LIST]"
   - For Qefas Hub SaaS Platform inquiries: If a school admin or teacher asks how to register or enroll students on Qefas Hub, EXPLAIN the process using the Knowledge Base (e.g., navigating to Dashboard -> Classes -> Enroll). Do NOT flag this request. Do NOT append [SHOW_LIST].
   - If the user asks for the website or portal, include the tag [SHOW_WEBSITE] at the very end of your response.
   - If the user asks about Qefas Prep school in general, include the tag [SHOW_ABOUT] at the very end of your response.
   - If the user asks about Qefas Hub in general or its features, include the tag [SHOW_HUB_ABOUT] at the very end of your response.
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

  let action: "SHOW_LIST" | "SHOW_WEBSITE" | "SHOW_ABOUT" | "SHOW_HUB_ABOUT" | "FLAG" | null = flagReason ? "FLAG" : null;

  if (rawReply.includes("[SHOW_LIST]")) {
    action = "SHOW_LIST";
  } else if (rawReply.includes("[SHOW_WEBSITE]")) {
    action = "SHOW_WEBSITE";
  } else if (rawReply.includes("[SHOW_HUB_ABOUT]")) {
    action = "SHOW_HUB_ABOUT";
  } else if (rawReply.includes("[SHOW_ABOUT]")) {
    action = "SHOW_ABOUT";
  }

  const reply = rawReply
    .replace(/\[SHOW_LIST\]/g, "")
    .replace(/\[SHOW_WEBSITE\]/g, "")
    .replace(/\[SHOW_HUB_ABOUT\]/g, "")
    .replace(/\[SHOW_ABOUT\]/g, "")
    .trim();

  return {
    reply,
    action,
    newName,
    flagReason,
  };
}
