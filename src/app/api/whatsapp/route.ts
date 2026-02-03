// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";
// import Pusher from "pusher";
// import OpenAI from "openai";
// import dbConnect from "@/lib/mongodb";
// import Conversation from "@/models/Conversation";

// export const runtime = "nodejs";

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

// const tools = [
//   {
//     type: "function",
//     function: {
//       name: "send_course_list",
//       description: "Sends the interactive WhatsApp menu showing all 6 courses.",
//     }
//   },
//   {
//     type: "function",
//     function: {
//       name: "send_registration_link",
//       description: "Sends the clickable 'Register Now' button for the website.",
//     }
//   }
// ];

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     /* 1. Parse Twilio Webhook */
//     const formData = await req.formData();
//     const userMsg = formData.get("Body")?.toString() || "";
//     const from = formData.get("From")?.toString() || "";

//     if (!userMsg || !from) {
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     /* 2. Find or Create Conversation */
//     let convo = await Conversation.findOne({ phoneNumber: from });

//     if (!convo) {
//       convo = await Conversation.create({
//         phoneNumber: from,
//         name: 'New Lead',
//         messages: [],
//         status: "bot",
//         lastMessageAt: new Date(),
//       });

//       // Notify Activity Feed of NEW conversation
//       await pusher.trigger("dashboard-updates", "new-activity", {
//         event: 'New WhatsApp Lead',
//         user: from.replace('whatsapp:', ''),
//         channel: { icon: 'chat', name: 'WhatsApp', color: 'text-green-500' },
//         time: 'Just now',
//         status: 'needs_action'
//       });
//     }

//     /* 3. Save User Message & Trigger Real-time */
//     const userMessageObj = {
//       body: userMsg,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     convo.messages.push(userMessageObj as any);
//     convo.lastMessageAt = new Date();
//     await convo.save();

//     // Trigger UI update for the USER message
//     const channelName = `chat-${convo._id.toString()}`;
//     await pusher.trigger(channelName, "new-message", userMessageObj);
    
//     // Update the sidebar list
//     await pusher.trigger("chat-updates", "new-message", {
//       conversationId: convo._id.toString(),
//       body: userMsg,
//       sender: "user"
//     });

//     /* 4. Stop AI if Human Took Over */
//     if (convo.status === "human") {
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     // /* 5. OpenAI Chat Completion */
//     // const response = await openai.chat.completions.create({
//     //   model: "gpt-4o-mini",
//     //   messages: [
//     //     {
//     //       role: "system",
//     //       content: `You are the Official AI Assistant for QEFAS Prep School... (rest of your prompt)`
//     //     },
//     //     { role: "user", content: userMsg }
//     //   ],
//     //   temperature: 0.7,
//     //   max_tokens: 300,
//     // });

//     // const aiReply = response.choices[0].message.content || "A counselor will assist you shortly.";
//     /* 5. OpenAI Chat Completion */
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: `You are the QEFAS assistant.
//         - If the user asks for all courses, say "[SHOW_LIST]".
//         - If the user wants the website, say "[SHOW_WEBSITE]".
//         - Otherwise, answer normally.`
//       },
//       { role: "user", content: userMsg }
//     ],
//   });
//   const aiReply = response.choices[0].message.content || " A representative will assist you shortly.";

//     /* 6. Save AI Reply & Trigger Real-time */

//     /* 6. Button Trigger Logic */
//   if (aiReply.includes("[SHOW_LIST]")) {
//     await twilioClient.messages.create({
//       from: from, // User's number (from the webhook)
//       to: 'whatsapp:+123456789', // Your Twilio WhatsApp number
//       contentSid: 'HX88472bd867abd715b9b9723532f7859b', // Replace with your approved SID
//     });
//     return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//   }

//   if (aiReply.includes("[SHOW_WEBSITE]")) {
//     await twilioClient.messages.create({
//       from: from,
//       to: 'whatsapp:+123456789',
//       contentSid: 'HXc875c0b83b3ced9f6a9b772f3dcc5c66', // Replace with your approved SID
//     });
//     return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//   }
//     const aiMessageObj = {
//       body: aiReply,
//       sender: "bot",
//       timestamp: new Date(),
//     };

//     convo.messages.push(aiMessageObj as any);
//     await convo.save();

//     // Trigger UI update for the AI reply
//     await pusher.trigger(channelName, "new-message", aiMessageObj);

//     /* 7. Reply to WhatsApp */
//     // const twiml = new twilio.twiml.MessagingResponse();
//     // twiml.message(aiReply);
//     const twiml = new twilio.twiml.MessagingResponse();
//   twiml.message(aiReply);
//   return new Response(twiml.toString(), { headers: { "Content-Type": "text/xml" } });


//     // return new Response(twiml.toString(), {
//     //   headers: { "Content-Type": "text/xml" },
//     // });

//   } catch (error) {
//     console.error("WhatsApp Webhook Error:", error);
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }
// }


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";
// import Pusher from "pusher";
// import OpenAI from "openai";
// import dbConnect from "@/lib/mongodb";
// import Conversation from "@/models/Conversation";

// export const runtime = "nodejs";

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });

// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const tools: any[] = [
//   {
//     type: "function",
//     function: {
//       name: "update_user_name",
//       description: "Updates the user's name in the database when they provide it.",
//       parameters: {
//         type: "object",
//         properties: {
//           newName: { type: "string", description: "The person's name" }
//         },
//         required: ["newName"]
//       }
//     }
//   }
// ];

// /**
//  * COURSE_MAP Configuration
//  * Key: The "Item ID" or the "Body Text" from the List Picker
//  * Value: Just the SLUG for the URL variable {{2}}
//  */
// const COURSE_MAP: Record<string, string> = {
//   "course_sss1": "sss1-course-self-paced-class-promo/",
//   "course_sss2": "sss2-course-self-paced-class-promo/",
//   "course_sss3": "sss3-course-self-paced-class-promo/",
//   "course_jss1": "jss1-course-self-paced-class-promo/",
//   "course_jss2": "jss2-course-self-paced-class-promo/",
//   "course_jss3": "jss3-course-self-paced-class-promo/"
// };

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     /* 1. Parse Twilio Webhook */
//     const formData = await req.formData();
//     const userMsg = formData.get("Body")?.toString() || ""; // Text (e.g. "JSS1")
//     const from = formData.get("From")?.toString() || "";     // User's WhatsApp
//     const to = formData.get("To")?.toString() || "";         // Your Twilio WhatsApp
//     const profileName = formData.get("ProfileName")?.toString() || "Student";
//     const listItemId = formData.get("ListId")?.toString(); 

//     if (!userMsg || !from) return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

//     /* 2. Find or Create Conversation */
//     let convo = await Conversation.findOne({ phoneNumber: from });
//     if (!convo) {
//       convo = await Conversation.create({
//         phoneNumber: from,
//         name: profileName,
//         messages: [],
//         status: "bot",
//         lastMessageAt: new Date(),
//       });
//     }

//     /* 3. Handle Direct Course Selections (Fast Path) */
//     const selectionKey = listItemId || userMsg;

//     if (COURSE_MAP[selectionKey]) {
//       const selectedSlug = COURSE_MAP[selectionKey];
      
//       await twilioClient.messages.create({
//         from: to, 
//         to: from,
//         contentSid: 'HXc875c0b83b3ced9f6a9b772f3dcc5c66', 
//         contentVariables: JSON.stringify({ 
//           "1": userMsg,     // Passes "JSS1" to {{1}} (Template already has "Course")
//           "2": selectedSlug // Passes slug to {{2}} (Template has hardcoded URL base)
//         })
//       });

//       convo.messages.push({ body: `User selected: ${userMsg}`, sender: "user", timestamp: new Date() } as any);
//       await convo.save();
      
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     /* 4. Save User Message & Real-time trigger */
//     const userMessageObj = { body: userMsg, sender: "user", timestamp: new Date() };
//     convo.messages.push(userMessageObj as any);
//     await convo.save();

//     const channelName = `chat-${convo._id.toString()}`;
//     await pusher.trigger(channelName, "new-message", userMessageObj);

//     if (convo.status === "human") return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

//     /* 5. OpenAI Chat Completion */
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `You are the QEFAS assistant. Student name: ${convo.name}.
//           - Use 'update_user_name' if they give a name.
//           - If they ask for courses, say "[SHOW_LIST]".
//           - If they want the website, say "[SHOW_WEBSITE]".`
//         },
//         { role: "user", content: userMsg }
//       ],
//       tools: tools
//     });

//     const choice = response.choices[0].message;
//     let aiReply = choice.content || "";

//     /* 6. Handle Tool Calls */
//     if (choice.tool_calls) {
//       for (const toolCall of choice.tool_calls) {
//         if (toolCall.type === 'function' && toolCall.function.name === "update_user_name") {
//           const { newName } = JSON.parse(toolCall.function.arguments);
//           convo.name = newName;
//           await convo.save();
//           aiReply = `Nice to meet you, ${newName}! I've updated your record. How can I help you today?`;
//         }
//       }
//     }

//     /* 7. Button Trigger Logic */
//     if (aiReply.includes("[SHOW_LIST]")) {
//       await twilioClient.messages.create({
//         from: to,
//         to: from,
//         contentSid: 'HX88472bd867abd715b9b9723532f7859b',
//         contentVariables: JSON.stringify({ "1": convo.name })
//       });
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     if (aiReply.includes("[SHOW_WEBSITE]")) {
//       await twilioClient.messages.create({
//         from: to,
//         to: from,
//         contentSid: 'HX88cea60a0722911d2aa32a399baccf5b',
//         contentVariables: JSON.stringify({ "1": convo.name })
//       });
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     /* 8. Save AI Reply & Final TwiML Response */
//     const aiMessageObj = { body: aiReply, sender: "bot", timestamp: new Date() };
//     convo.messages.push(aiMessageObj as any);
//     await convo.save();
//     await pusher.trigger(channelName, "new-message", aiMessageObj);

//     const twiml = new twilio.twiml.MessagingResponse();
//     twiml.message(aiReply);
//     return new Response(twiml.toString(), { headers: { "Content-Type": "text/xml" } });

//   } catch (error) {
//     console.error("WhatsApp Webhook Error:", error);
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";
// import Pusher from "pusher";
// import OpenAI from "openai";
// import dbConnect from "@/lib/mongodb";
// import Conversation from "@/models/Conversation";
// import Knowledge from "@/models/Knowledge";

// export const runtime = "nodejs";

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });

// async function getRelevantKnowledge(userMsg: string) {
//   const words = userMsg.toLowerCase().split(" ");
//   // Simple keyword search in MongoDB
//   const facts = await Knowledge.find({
//     $or: [
//       { category: { $in: words.map(w => new RegExp(w, "i")) } },
//       { tags: { $in: words.map(w => new RegExp(w, "i")) } }
//     ]
//   }).limit(3);

//   return facts.map(f => f.answer).join("\n");
// }

// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const tools: any[] = [
//   {
//     type: "function",
//     function: {
//       name: "update_user_name",
//       description: "Updates the user's name in the database when they provide it.",
//       parameters: {
//         type: "object",
//         properties: {
//           newName: { type: "string", description: "The person's name" }
//         },
//         required: ["newName"]
//       }
//     }
//   }
// ];

// const COURSE_MAP: Record<string, string> = {
//   "course_sss1": "sss1-course-self-paced-class-promo/",
//   "course_sss2": "sss2-course-self-paced-class-promo/",
//   "course_sss3": "sss3-course-self-paced-class-promo/",
//   "course_jss1": "jss1-course-self-paced-class-promo/",
//   "course_jss2": "jss2-course-self-paced-class-promo/",
//   "course_jss3": "jss3-course-self-paced-class-promo/"
// };

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     /* 1. Parse Twilio Webhook */
//     const formData = await req.formData();
//     const userMsg = formData.get("Body")?.toString() || "";
//     const from = formData.get("From")?.toString() || "";
//     const to = formData.get("To")?.toString() || "";
//     const profileName = formData.get("ProfileName")?.toString() || "Student";
//     const listItemId = formData.get("ListId")?.toString(); 

//     if (!userMsg || !from) return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

//     /* 2. Find or Create Conversation */
//     let convo = await Conversation.findOne({ phoneNumber: from });
//     let isNewLead = false;

//     if (!convo) {
//       isNewLead = true;
//       convo = await Conversation.create({
//         phoneNumber: from,
//         name: "New Lead", // Set a placeholder to detect if we need a real name
//         messages: [],
//         status: "bot",
//         lastMessageAt: new Date(),
//       });
//     }

//     /* 3. Handle Direct Course Selections */
//     const selectionKey = listItemId || userMsg;
//     if (COURSE_MAP[selectionKey]) {
//       const selectedSlug = COURSE_MAP[selectionKey];
//       await twilioClient.messages.create({
//         from: to, 
//         to: from,
//         contentSid: 'HXc875c0b83b3ced9f6a9b772f3dcc5c66', 
//         contentVariables: JSON.stringify({ "1": userMsg, "2": selectedSlug })
//       });
//       convo.messages.push({ body: `User selected: ${userMsg}`, sender: "user", timestamp: new Date() } as any);
//       await convo.save();
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     /* 4. Save User Message */
//     const userMessageObj = { body: userMsg, sender: "user", timestamp: new Date() };
//     convo.messages.push(userMessageObj as any);
//     await convo.save();

//     const channelName = `chat-${convo._id.toString()}`;
//     await pusher.trigger(channelName, "new-message", userMessageObj);

//     if (convo.status === "human") return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

//     /* 5. OpenAI Chat Completion */
//     const messages: any[] = [
//       {
//         role: "system",
//         content: `You are the QEFAS assistant. Current Student Name: ${convo.name}.
//         - If Name is "New Lead", ask for their name.
//         - Use 'update_user_name' as soon as they provide it.
//         - If they ask for courses, say "[SHOW_LIST]".
//         - If they want the website, say "[SHOW_WEBSITE]".`
//       },
//       { role: "user", content: userMsg }
//     ];

//     const  response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: messages,
//       tools: tools
//     });

//     let choice = response.choices[0].message;

//     /* 6. Handle Tool Calls (The Loop) */
//     if (choice.tool_calls) {
//       const toolCall = choice.tool_calls[0]; // Assuming one call at a time
//       if (toolCall.type === 'function' && toolCall.function.name === "update_user_name") {
//         const { newName } = JSON.parse(toolCall.function.arguments);
        
//         // 1. Update DB
//         convo.name = newName;
//         await convo.save();

//         // 2. Add the AI's tool request and your "Success" result to the message history
//         messages.push(choice); 
//         messages.push({
//           role: "tool",
//           tool_call_id: toolCall.id,
//           content: "Successfully updated the user name in the database."
//         });

//         // 3. Ask OpenAI for a FINAL text response now that it knows the name is saved
//         const finalResponse = await openai.chat.completions.create({
//           model: "gpt-4o-mini",
//           messages: messages
//         });
//         choice = finalResponse.choices[0].message;
//       }
//     }

//     const aiReply = choice.content || "";
//     /* 7. Button Trigger Logic */
//     if (aiReply.includes("[SHOW_LIST]")) {
//       await twilioClient.messages.create({
//         from: to,
//         to: from,
//         contentSid: 'HX88472bd867abd715b9b9723532f7859b',
//         contentVariables: JSON.stringify({ "1": convo.name })
//       });
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     if (aiReply.includes("[SHOW_WEBSITE]")) {
//       await twilioClient.messages.create({
//         from: to,
//         to: from,
//         contentSid: 'HX88cea60a0722911d2aa32a399baccf5b',
//         contentVariables: JSON.stringify({ "1": convo.name })
//       });
//       return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
//     }

//     /* 8. Save AI Reply & Final Response */
//     const aiMessageObj = { body: aiReply, sender: "bot", timestamp: new Date() };
//     convo.messages.push(aiMessageObj as any);
//     await convo.save();
//     await pusher.trigger(channelName, "new-message", aiMessageObj);

//     const twiml = new twilio.twiml.MessagingResponse();
//     twiml.message(aiReply);
//     return new Response(twiml.toString(), { headers: { "Content-Type": "text/xml" } });

//   } catch (error) {
//     console.error("WhatsApp Webhook Error:", error);
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import Pusher from "pusher";
import OpenAI from "openai";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Knowledge from "@/models/Knowledge";

export const runtime = "nodejs";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Improved RAG Logic: More flexible matching for your training data
 */
async function getRelevantKnowledge(userMsg: string) {
  // Extract words longer than 2 chars
  const words = userMsg.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (words.length === 0) return "No specific context found.";
  
  // Fuzzy regex (removed \b for better matching of partial words like 'price' in 'pricing')
  const regexes = words.map(w => new RegExp(w, "i"));
  
  const facts = await Knowledge.find({
    $or: [
      { category: { $in: regexes } }, 
      { question: { $in: regexes } }, 
      { tags: { $in: regexes } },
      { answer: { $in: regexes } } // Added answer search
    ]
  }).limit(5); // Increased limit for better AI coverage

  if (facts.length === 0) return "No specific school data found for this query.";

  return facts.map(f => `[Fact: ${f.question}]: ${f.answer}`).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const userMsg = formData.get("Body")?.toString() || "";
    const from = formData.get("From")?.toString() || "";
    const to = formData.get("To")?.toString() || "";

    if (!userMsg || !from) return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

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

    if (convo.status === "human") return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });

    const knowledgeContext = await getRelevantKnowledge(userMsg);
    const isNewLead = convo.name === "New Lead";

    // Dynamic System Prompt
    const systemPrompt = isNewLead 
      ? "You are the QEFAS assistant. This is a NEW user. You MUST politely ask for their name first. Do NOT answer school questions until you have their name."
      : `You are the QEFAS assistant. User's name is ${convo.name}. 
         Use this Context to answer: 
         ${knowledgeContext}
         
         Rules:
         1. If the context doesn't have the answer, say you'll refer them to a human.
         2. If they ask for courses or pricing, answer briefly then include the phrase [SHOW_LIST] at the end.`;

    const tools: any[] = isNewLead ? [{
      type: "function",
      function: {
        name: "update_user_name",
        description: "Saves the user's name.",
        parameters: {
          type: "object",
          properties: { newName: { type: "string" } },
          required: ["newName"]
        }
      }
    }] : [];

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMsg }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools: tools.length > 0 ? tools : undefined,
    });

    let choice = response.choices[0].message;

    // Handle Name Update Tool
    if (choice.tool_calls && choice.tool_calls.length > 0) {
      const toolCall = choice.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.name === 'update_user_name') {
        const args = JSON.parse(toolCall.function.arguments);
        convo.name = args.newName;
        await convo.save();

        messages.push(choice);
        messages.push({ role: "tool", tool_call_id: toolCall.id, content: "Success" });
        
        // Final response after saving name
        const secondRes = await openai.chat.completions.create({ model: "gpt-4o-mini", messages });
        choice = secondRes.choices[0].message;
      }
    }

    const aiReply = choice.content || "";

    // Template + Reply Logic
    const twiml = new twilio.twiml.MessagingResponse();
    
    if (aiReply.includes("[SHOW_LIST]")) {
      // Send the official template
      await twilioClient.messages.create({
        from: to, to: from,
        contentSid: 'HX88472bd867abd715b9b9723532f7859b',
        contentVariables: JSON.stringify({ "1": convo.name })
      });
      // Also send the AI's text explanation via TwiML so the user gets both
      twiml.message(aiReply.replace("[SHOW_LIST]", ""));
    } else {
      twiml.message(aiReply);
    }

    // Save to DB and Update Dashboard
    const userObj = { body: userMsg, sender: "user", timestamp: new Date() };
    const botObj = { body: aiReply, sender: "bot", timestamp: new Date() };
    
    convo.messages.push(userObj as any);
    convo.messages.push(botObj as any);
    await convo.save();

    await pusher.trigger(`chat-${convo._id}`, "new-message", userObj);
    await pusher.trigger(`chat-${convo._id}`, "new-message", botObj);

    return new Response(twiml.toString(), { headers: { "Content-Type": "text/xml" } });

  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
  }
}