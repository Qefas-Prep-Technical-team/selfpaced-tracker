export function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) chunks.push(chunk);
    if (i + chunkSize >= words.length) break;
  }

  return chunks;
}
