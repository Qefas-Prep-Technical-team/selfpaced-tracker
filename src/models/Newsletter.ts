import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Updated TypeScript interface
export interface INewsletter extends Document {
  email: string;
  status: "active" | "processing" | "inactive"; // Added status
  subscribedAt: Date;
}

// 2. Updated Schema
const NewsletterSchema = new Schema<INewsletter>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // Added status field with validation
  status: {
    type: String,
    enum: ["active", "processing", "inactive"],
    default: "active",
    required: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

// 3. Export the model
const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;
