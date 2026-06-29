import { pipeline } from '@xenova/transformers';

let embedderPromise;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedderPromise;
}

export async function embed(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Call this once on server startup to avoid a slow first request
export async function warmUpEmbedder() {
  await getEmbedder();
  console.log('Embedder warmed up');
}
