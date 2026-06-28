import mongoose from 'mongoose';

const ReportRecipientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReportRecipient =
  mongoose.models.ReportRecipient ||
  mongoose.model('ReportRecipient', ReportRecipientSchema);
