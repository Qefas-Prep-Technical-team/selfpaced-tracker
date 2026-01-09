import { NextRequest, NextResponse } from 'next/server';

import Conversation from '@/models/Conversation';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Pusher from 'pusher';
import twilio from 'twilio';
import dbConnect from '@/lib/mongodb';

// Initialize Pusher for real-time dashboard updates
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // 1. Parse Twilio's incoming request (URL-encoded formData)
    const formData = await req.formData();
    const userMsg = formData.get('Body') as string;
    const from = formData.get('From') as string; // Format: 'whatsapp:+123456789'

    // 2. Find or Create the Lead in MongoDB
    let convo = await Conversation.findOne({ phoneNumber: from });
    if (!convo) {
      convo = await Conversation.create({ 
        phoneNumber: from, 
        messages: [],
        status: 'bot' 
      });
    }

    // 3. Save the User's Message to DB
    convo.messages.push({ body: userMsg, sender: 'user', timestamp: new Date() });
    
    // 4. Send Real-time Ping to Dashboard
    await pusher.trigger('chat-channel', 'incoming-message', {
      phoneNumber: from,
      body: userMsg,
      status: convo.status,
    });

    // 5. Check Handoff Status: If Admin is in control, STOP AI.
    if (convo.status === 'human') {
      await convo.save();
      // Return empty TwiML so Twilio knows we received it but won't auto-reply
      return new Response('<Response></Response>', {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // 6. Get AI Response from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // System Prompt for context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: "You are a helpful sales assistant for 'Converge CRM'. Be polite and professional. If you don't know an answer, tell them an agent will be with them shortly." }],
        },
      ],
    });

    const result = await chat.sendMessage(userMsg);
    const aiReply = result.response.text();

    // 7. Save AI Message & Update Last Activity
    convo.messages.push({ body: aiReply, sender: 'bot', timestamp: new Date() });
    convo.lastMessageAt = new Date();
    await convo.save();

    // 8. Reply to Twilio with TwiML
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiReply);

    return new Response(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}