// @ts-nocheck
import { NextResponse } from 'next/server';
import { index } from '../../../../lib/pinecone.js';

export async function DELETE() {
  try {
    // Pinecone v8 deleteAll clears the current namespace
    await index.deleteAll();
    return NextResponse.json({ message: 'All vectors successfully deleted.' });
  } catch (err: any) {
    console.error('Error clearing Pinecone:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
