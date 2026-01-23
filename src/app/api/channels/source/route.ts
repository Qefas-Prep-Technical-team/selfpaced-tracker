import dbConnect from '@/lib/mongodb';
import { Channel } from '@/models/Channel';
import { NextResponse } from 'next/server';


// Define headers clearly
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.selfpaced.qefas.com', // Change this to your specific domain in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle Preflight (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}



export async function GET() {
  try {
   await dbConnect();
    
    const channels = await Channel.find({ status: 'active' })
      .select('name _id createdAt') // Add createdAt here
      .sort({ name: 1 });

  return NextResponse.json(
      { success: true, data: channels }, 
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Fetch Channels Error:', error);
   
     return NextResponse.json(
      { success: false }, 
      { status: 500, headers: corsHeaders }
    )
  }
}