import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    user: { type: String, required: true }, // The item name (e.g., "Facebook Ads")
    adminEmail: { type: String, required: true }, // Changed from adminName
    channelName: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: "deleted" },
  },
  { timestamps: true },
);

// IMPORTANT: Delete the old model from cache so Mongoose reloads the new schema
export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
