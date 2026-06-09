import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  title: string;
  channel: "dnd" | "generic" | "whatsapp" | "voice";
  message: string;
  recipientsCount: number;
  recipients: string[];
  status: "pending" | "sent" | "failed";
  costUnits: number;
  sentAt: Date;
  termiiResponse?: any;
}

const CampaignSchema = new Schema<ICampaign>({
  title: { type: String, default: "Campaign" },
  channel: { type: String, enum: ["dnd", "generic", "whatsapp", "voice"], required: true },
  message: { type: String, required: true },
  recipientsCount: { type: Number, required: true },
  recipients: [{ type: String }],
  status: { type: String, enum: ["pending", "sent", "failed"], default: "sent" },
  costUnits: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now },
  termiiResponse: { type: Schema.Types.Mixed }
});

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
