import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript interface for a Newsletter document
export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
}

// 2. Define the Schema
const NewsletterSchema = new Schema<INewsletter>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true 
  },
  subscribedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// 3. Export the model (checking if it already exists to prevent Next.js re-compilation errors)
const Newsletter: Model<INewsletter> = 
  mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter;