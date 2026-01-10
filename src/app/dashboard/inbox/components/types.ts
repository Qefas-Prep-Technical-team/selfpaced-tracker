export type MessageSender = "user" | "bot" | "human";

export interface Message {
  _id?: string;
  body: string;
  sender: MessageSender;
  timestamp: string;
  conversationId?: string;
}

export type ConversationStatus = "bot" | "human";

export interface Conversation {
  _id?: string;
  phoneNumber: string;
  name?: string;
  messages: Message[];
  status: ConversationStatus;
  lastMessageAt?: string;
  isSubscribedToNewsletter?: boolean;
  avatar?: string;
  email?: string;
  tags?: string[];
  lastSeen?: string;
}

export interface HandoffPayload {
  phoneNumber: string;
  newStatus: ConversationStatus;
}

export interface SendMessagePayload {
  phoneNumber: string;
  body: string;
  sender: MessageSender;
}

export interface IncomingMessageData {
  phoneNumber: string;
  body: string;
  sender: MessageSender;
  timestamp: string;
}
