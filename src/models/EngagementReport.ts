import mongoose from 'mongoose';

const EngagementReportSchema = new mongoose.Schema(
  {
    nameChannel: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    hotLeads: { type: Number, required: true, default: 0 },
    convertedStudents: { type: Number, required: true, default: 0 },
    flyersDistributed: { type: Number, required: true, default: 0 },
    giftsDistributed: { type: Number, required: true, default: 0 },
    contactsUploaded: { type: Number, required: true, default: 0 },
    dataCollected: { type: String, default: '' },
    challenges: { type: String, default: '' },
    suggestions: { type: String, default: '' },
    objections: [{ type: String }],
    supportNeeded: [{ type: String }],
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

export const EngagementReport =
  mongoose.models.EngagementReport ||
  mongoose.model('EngagementReport', EngagementReportSchema);
