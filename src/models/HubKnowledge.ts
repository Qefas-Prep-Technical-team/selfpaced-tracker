import mongoose from "mongoose";

const HubKnowledgeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tags: [String]
});

export default mongoose.models.HubKnowledge || mongoose.model("HubKnowledge", HubKnowledgeSchema);
