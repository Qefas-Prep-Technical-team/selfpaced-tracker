// @ts-nocheck
import { NextResponse } from 'next/server';
const { PDFParse } = require('pdf-parse');
import { embed } from '../../../../lib/embeddings.js';
import { chunkText } from '../../../../lib/chunk.js';
import { index } from '../../../../lib/pinecone.js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert Next.js File object to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text;
    await parser.destroy(); // Free memory

    const chunks = chunkText(text);

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'No readable text could be extracted from this PDF. It may be a scanned image.' }, { status: 400 });
    }

    const vectors = await Promise.all(
      chunks.map(async (chunk: string, i: number) => ({
        id: `${file.name}-${Date.now()}-${i}`,
        values: await embed(chunk),
        metadata: { text: chunk, source: file.name }
      }))
    );

    await index.upsert({ records: vectors });

    return NextResponse.json({ message: 'PDF ingested', chunks: chunks.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
