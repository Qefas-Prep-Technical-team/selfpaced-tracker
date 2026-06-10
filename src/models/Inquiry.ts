// models/Inquiry.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IContactHistory {
  contactedAt: Date;
  contactMethod: 'sms' | 'whatsapp' | 'call' | 'other';
  message: string;
}

export interface IInquiry extends Document {
  parentName: string;
  parentNameNormalized: string;
  childClass: string;
  whatsapp: string;
  channelId: mongoose.Types.ObjectId;
  channelName: string;
  status: 'new' | 'contacted' | 'follow-up' | 'resolved' | 'lost';
  contactHistory: IContactHistory[];
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>({
  parentName: {
    type: String,
    required: true,
    trim: true,
  },

  // 🔥 used ONLY for uniqueness checks
  parentNameNormalized: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,     // ✅ ENFORCED HERE
    index: true,
  },

  childClass: {
    type: String,
    required: true,
  },

  whatsapp: {
    type: String,
    required: true,
    trim: true,
  },

  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },

  channelName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['new', 'contacted', 'follow-up', 'resolved', 'lost'],
    default: 'new',
  },

  contactHistory: {
    type: [
      {
        contactedAt: { type: Date, default: Date.now },
        contactMethod: { type: String, enum: ['sms', 'whatsapp', 'call', 'other'], required: true },
        message: { type: String, default: '' },
      }
    ],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
