import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "JSS1", "General", "Pricing"
  question: { type: String, required: true }, // The "Key" or common question
  answer: { type: String, required: true },   // The factual answer
  tags: [String]                              // e.g., ["math", "curriculum"]
});

export default mongoose.models.Knowledge || mongoose.model("Knowledge", KnowledgeSchema);