import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvite extends Document {
  email: string;
  token: string;
  role: "viewer" | "admin" | "editor";
  status: "pending" | "accepted";
  expiresAt: Date;
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["viewer", "admin", "editor"],
    default: "viewer",
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  // This Date field will be compared against the TTL index
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Automatically deletes when this date is reached
  },
}, { timestamps: true });

const Invite: Model<IInvite> =
  mongoose.models.Invite || mongoose.model<IInvite>("Invite", InviteSchema);

export default Invite;