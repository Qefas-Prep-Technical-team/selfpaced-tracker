/* eslint-disable @typescript-eslint/no-explicit-any */
import Knowledge from "@/models/Knowledge";

export async function getRelevantKnowledge(userMsg: string) {
  try {
    const cleanedMsg = userMsg.trim().toLowerCase();
    const keywords = cleanedMsg.split(/\s+/).filter((word) => word.length > 2);

    const escapedMsg = cleanedMsg.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

    const query = {
      $or: [
        { category: { $regex: escapedMsg, $options: "i" } },
        { question: { $regex: escapedMsg, $options: "i" } },
        { tags: { $in: keywords.map((k) => new RegExp(`^${k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}$`, "i")) } },
        { tags: { $in: keywords.map((k) => new RegExp(k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), "i")) } },
      ],
    };

    const matches = await Knowledge.find(query).limit(5).lean();
    
    if (matches.length === 0) return "";

    return matches
      .map((k: any) => `[${k.category}] Q: ${k.question}\nA: ${k.answer}`)
      .join("\n\n");
  } catch (error) {
    console.error("Knowledge lookup error:", error);
    return "";
  }
}
