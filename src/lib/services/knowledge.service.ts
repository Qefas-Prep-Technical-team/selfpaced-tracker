/* eslint-disable @typescript-eslint/no-explicit-any */
import Knowledge from "@/models/Knowledge";

export async function getRelevantKnowledge(userMsg: string) {
  try {
    const cleanedMsg = userMsg.trim().toLowerCase();
    const keywords = cleanedMsg.split(/\s+/).filter((word) => word.length > 2);

    const query = {
      $or: [
        { category: { $regex: cleanedMsg, $options: "i" } },
        { question: { $regex: cleanedMsg, $options: "i" } },
        { tags: { $in: keywords.map((k) => new RegExp(`^${k}$`, "i")) } },
        { tags: { $in: keywords.map((k) => new RegExp(k, "i")) } },
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
