import { NextRequest, NextResponse } from 'next/server';
import { getRelevantKnowledge, getHubKnowledge } from '@/lib/services/knowledge.service';
import { embed } from '../../../lib/embeddings.js';
import { index } from '../../../lib/pinecone.js';
import dbConnect from '@/lib/mongodb';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { question, mode = 'auto', history = [] } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    let systemPrompt = "";
    let context = "";
    let sources: any[] = [];
    
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Determine the active mode
    let activeMode = mode;
    
    // AI Router: If mode is auto, dynamically classify intent
    if (activeMode === 'auto') {
      try {
        const routerResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0,
          max_tokens: 10,
          messages: [
            { 
              role: "system", 
              content: "You are a routing assistant. Analyze the user's message and determine if it is about 'Qefas Hub' (B2B SaaS, administration, subdomains, registration, grading, AI remarks) or 'Qefas Prep School' (video courses, tutors, primary/secondary learning). Output strictly one word: 'HUB' or 'PREP'." 
            },
            { role: "user", content: question }
          ]
        });
        
        const intent = routerResponse.choices[0]?.message?.content?.trim().toUpperCase() || 'PREP';
        activeMode = intent === 'HUB' ? 'hub' : 'general';
        console.log(`AI Router classified intent as: ${intent} -> Mode: ${activeMode}`);
      } catch (err) {
        console.error("AI Router failed, falling back to general mode", err);
        activeMode = 'general';
      }
    }

    if (activeMode === 'general') {
      // Fetch exact knowledge context from MongoDB for Prep School (uses Knowledge model)
      context = await getRelevantKnowledge(question);
      
      systemPrompt = `You are the official support representative for Qefas Prep School. 
CRITICAL RULES:
1. You MUST rely 100% on the KNOWLEDGE BASE provided below. 
2. Speak in a highly professional, polished, and natural tone, like an expert human support agent. Be concise and direct.
3. Answer directly without any preamble. Do NOT mention that you are reading from a "knowledge base" or "context". Do NOT say "According to the provided context" or "Based on the information". Simply state the facts.
4. When presenting multiple items or capabilities, ALWAYS use numbered lists (1, 2, 3) instead of bullet points.
5. If the user asks for ANY general knowledge, writes code, asks for calculations, or asks ANYTHING outside the scope of Qefas Prep School, you MUST REJECT IT.
6. Exception for Greetings: If the user ONLY sends a greeting (e.g. "hello", "hi"), respond warmly and ask how you can assist them. However, if they include a question with the greeting (e.g. "hi I need help with..."), skip asking how you can assist and directly address their request!
7. For all other questions: If you do not know the answer (e.g. if it is not in the knowledge base), you MUST NOT guess. 
8. If you cannot answer based on the knowledge base, you MUST output ONLY this exact phrase and absolutely nothing else: "I don't have that specific detail on hand, but I will flag this for our administrative team so they can assist you further. 😊"

KNOWLEDGE BASE:
${context || "No specific matching documents found in the database."}`;
    } else {
      // Qefas Hub Mode Logic (uses HubKnowledge model)
      context = await getHubKnowledge(question);
      sources = []; // MongoDB doesn't return vector scores in this setup

      systemPrompt = `You are the official support representative for Qefas Hub, an Educational Management SaaS platform for schools. 
CRITICAL RULES:
1. You MUST rely 100% on the context provided below. 
2. Speak in a highly professional, polished, and natural tone, like an expert human support agent. Be concise and direct.
3. Answer directly without any preamble. Do NOT mention that you are reading from a "knowledge base" or "context". Do NOT say "According to the provided context" or "Based on the information". Simply state the facts.
4. When presenting multiple items or capabilities, ALWAYS use numbered lists (1, 2, 3) instead of bullet points.
5. If the user asks for ANY general knowledge, writes code, asks for calculations, or asks ANYTHING outside the scope of Qefas Hub support, you MUST REJECT IT.
6. Exception for Greetings: If the user ONLY sends a greeting (e.g. "hello", "hi"), respond warmly and ask how you can assist them. However, if they include a question with the greeting (e.g. "hi I need help with..."), skip asking how you can assist and directly address their request!
7. Role Identification: If a user asks about registration, onboarding, or features, and you don't know their role, gently ask if they are a School Administrator, Teacher, Student, or Parent so you can provide the correct instructions and links.
8. Registration Clarification: If a parent asks how to register a student, clarify that they cannot do it from their parent dashboard, but they CAN simply provide the student self-registration link (qefashub.com/signup/student) to the student, or use the parent link (qefashub.com/signup/parent).
9. NEVER use visual action tags like [SHOW_LIST], [SHOW_ABOUT], or mention video courses. This is a B2B SaaS platform, NOT a preparatory school.
10. For all other questions: If the answer is NOT explicitly written in the context, you MUST NOT guess.
11. If you cannot answer based on the context, you MUST output ONLY this exact phrase and absolutely nothing else: "I don't have that specific detail on hand, but I will flag this for our technical team so they can assist you further. 😊"

Context:
${context}`;
    }

    // Format history for OpenAI
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Initialize OpenAI already done at the top

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper, matches Telegram logic
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: question }
      ]
    });

    if (!completion.choices || completion.choices.length === 0) {
      console.error('OpenAI error:', completion);
      return NextResponse.json({ 
        answer: "I don't have that specific detail on hand, but I will flag this for our technical team so they can assist you further. 😊",
        sources: [] 
      });
    }

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      sources: sources
    });
  } catch (err: any) {
    console.error("General API Error:", err);
    return NextResponse.json({ 
      answer: "I don't have that specific detail on hand, but I will flag this for our technical team so they can assist you further. 😊",
      sources: [] 
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
    },
  });
}
