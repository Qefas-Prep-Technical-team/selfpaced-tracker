// models/Inquiry.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  parentName: string;
  childClass: string;
  whatsapp: string;
  status: 'new' | 'contacted' | 'follow-up';
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>({
  parentName: { type: String, required: true },
  childClass: { type: String, required: true },
  whatsapp: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'follow-up'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
