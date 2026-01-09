import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the Message structure
export interface IMessage {
  body: string;
  sender: 'user' | 'bot' | 'human';
  timestamp: Date;
}

// 2. Define the Conversation (Lead) structure
export interface IConversation extends Document {
  phoneNumber: string;
  name: string;
  status: 'bot' | 'human';
  messages: IMessage[];
  lastMessageAt: Date;
  isSubscribedToNewsletter: boolean;
}

const MessageSchema = new Schema<IMessage>({
  body: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot', 'human'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema<IConversation>({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, default: 'New Lead' },
  status: { type: String, enum: ['bot', 'human'], default: 'bot' },
  messages: [MessageSchema],
  lastMessageAt: { type: Date, default: Date.now },
  isSubscribedToNewsletter: { type: Boolean, default: false }
}, { timestamps: true });

// 3. Export the model
const Conversation: Model<IConversation> = 
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;