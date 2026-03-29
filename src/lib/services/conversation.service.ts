/* eslint-disable @typescript-eslint/no-explicit-any */
import Conversation from "@/models/Conversation";

export async function findOrCreateConversation(phoneNumber: string) {
  let convo = await Conversation.findOne({ phoneNumber });

  if (!convo) {
    convo = await Conversation.create({
      phoneNumber,
      name: "New Lead",
      messages: [],
      status: "bot",
      lastMessageAt: new Date(),
      lastButtonSent: null,
    });
  }

  return convo;
}

export async function saveUserMessage(convo: any, body: string) {
  convo.messages.push({
    body,
    sender: "user",
    timestamp: new Date(),
  });

  convo.lastMessageAt = new Date();
  await convo.save();
}

export async function saveBotMessage(convo: any, body: string) {
  convo.messages.push({
    body,
    sender: "bot",
    timestamp: new Date(),
  });

  convo.lastMessageAt = new Date();
  await convo.save();
}

export async function saveSelectionMessage(convo: any, body: string) {
  convo.messages.push({
    body: `User selected: ${body}`,
    sender: "user",
    timestamp: new Date(),
  });

  convo.lastMessageAt = new Date();
  await convo.save();
}

export async function updateConversationName(convo: any, newName: string) {
  convo.name = newName.trim();
  await convo.save();
}

export async function updateLastInteractiveSent(
  convo: any,
  value: string | null,
) {
  convo.lastButtonSent = value;
  await convo.save();
}
