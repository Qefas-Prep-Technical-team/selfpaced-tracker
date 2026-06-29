import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

let index;
try {
  if (process.env.PINECONE_API_KEY && process.env.PINECONE_API_KEY !== 'your_key_here') {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    index = pc.index(process.env.PINECONE_INDEX || 'flexiti-rag');
  }
} catch (e) {
  console.error('Pinecone init error:', e);
}
export { index };
