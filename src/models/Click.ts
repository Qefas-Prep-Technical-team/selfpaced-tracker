import mongoose, { Schema, model, models } from "mongoose";

const ClickSchema = new Schema({
  category: { type: String, required: true },
  label: { type: String },
  url: { type: String },
  path: { type: String },
  clickedAt: { type: Date, default: Date.now },
  city: { type: String },      // Keep this
  country: { type: String },   // Keep this
  userAgent: { type: String }
});

const Click = models.Click || model("Click", ClickSchema);
export default Click;