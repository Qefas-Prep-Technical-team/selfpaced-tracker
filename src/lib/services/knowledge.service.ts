/* eslint-disable @typescript-eslint/no-explicit-any */
import Knowledge from "@/models/Knowledge";
import HubKnowledge from "@/models/HubKnowledge";

export async function getRelevantKnowledge(userMsg: string) {
  try {
    const cleanedMsg = userMsg.trim().toLowerCase();
    // Filter out common stop words to get better keywords
    const stopWords = ['how', 'much', 'are', 'the', 'is', 'what', 'in', 'on', 'at', 'to', 'for', 'a', 'an', 'of', 'and'];
    const keywords = cleanedMsg.split(/\s+/).filter((word) => word.length > 2 && !stopWords.includes(word));

    const escapedMsg = cleanedMsg.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

    // Create regex patterns for keywords
    const keywordRegexes = keywords.map(k => new RegExp(k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'));

    const searchConditions = [
      { category: { $regex: escapedMsg, $options: "i" } },
      { question: { $regex: escapedMsg, $options: "i" } },
      { tags: { $in: keywordRegexes } }
    ];

    // If we have meaningful keywords, also search if any keyword matches the question or answer
    if (keywordRegexes.length > 0) {
      searchConditions.push({ question: { $in: keywordRegexes } } as any);
      // We can also search answers if needed, but it might return too many false positives.
    }

    const query: any = { $or: searchConditions };

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

export async function getHubKnowledge(userMsg: string) {
  try {
    const cleanedMsg = userMsg.trim().toLowerCase();
    const stopWords = ['how', 'much', 'are', 'the', 'is', 'what', 'in', 'on', 'at', 'to', 'for', 'a', 'an', 'of', 'and'];
    const keywords = cleanedMsg.split(/\s+/).filter((word) => word.length > 2 && !stopWords.includes(word));

    const escapedMsg = cleanedMsg.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const keywordRegexes = keywords.map(k => new RegExp(k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i'));

    const searchConditions = [
      { category: { $regex: escapedMsg, $options: "i" } },
      { question: { $regex: escapedMsg, $options: "i" } },
      { tags: { $in: keywordRegexes } }
    ];

    if (keywordRegexes.length > 0) {
      searchConditions.push({ question: { $in: keywordRegexes } } as any);
    }

    const query: any = { $or: searchConditions };

    const matches = await HubKnowledge.find(query).limit(5).lean();
    
    if (matches.length === 0) return "";

    return matches
      .map((k: any) => `[${k.category}] Q: ${k.question}\nA: ${k.answer}`)
      .join("\n\n");
  } catch (error) {
    console.error("HubKnowledge lookup error:", error);
    return "";
  }
}
