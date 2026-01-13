// models/Inquiry.ts
import mongoose, { Document, Model } from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IInquiry extends Document {
  parentName: string;
  childClass: string;
  whatsapp: string;
 channelId: mongoose.Types.ObjectId; // The Database ID
  channelName: string;// Store the ID
  status: 'new' | 'contacted' | 'follow-up';
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>({
  parentName: { type: String, required: true },
  childClass: { type: String, required: true },
  whatsapp: { type: String, required: true },
 // Reference for relations
  channelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Channel', 
    required: true 
  },
  // Plain string for easy display
  channelName: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'follow-up'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;