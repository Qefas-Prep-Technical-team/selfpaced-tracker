// @ts-nocheck
import { NextResponse } from 'next/server';
import { embed } from '../../../../lib/embeddings.js';
import { chunkText } from '../../../../lib/chunk.js';
import { index } from '../../../../lib/pinecone.js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, source } = body;

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const chunks = chunkText(text);
    const vectors = await Promise.all(
      chunks.map(async (chunk: string, i: number) => ({
        id: `${source || 'text'}-${Date.now()}-${i}`,
        values: await embed(chunk),
        metadata: { text: chunk, source: source || 'manual' }
      }))
    );

    await index.upsert({ records: vectors });
    
    return NextResponse.json({ message: 'Text ingested', chunks: chunks.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
