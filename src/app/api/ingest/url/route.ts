// @ts-nocheck
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { embed } from '../../../../lib/embeddings.js';
import { chunkText } from '../../../../lib/chunk.js';
import { index } from '../../../../lib/pinecone.js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Remove scripts, styles, nav, footer, header to focus on main content
    $('script, style, nav, footer, header').remove();
    
    // Extract text and clean up whitespace
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    if (!text) {
      return NextResponse.json({ error: 'No readable text found at URL' }, { status: 400 });
    }

    const chunks = chunkText(text);
    const vectors = await Promise.all(
      chunks.map(async (chunk: string, i: number) => ({
        id: `url-${Date.now()}-${i}`,
        values: await embed(chunk),
        metadata: { text: chunk, source: url }
      }))
    );

    await index.upsert({ records: vectors });
    
    return NextResponse.json({ message: 'URL content ingested', chunks: chunks.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
