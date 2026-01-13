// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { Channel } from '@/models/Channel';

// Define headers clearly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Change this to your specific domain in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle Preflight (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// app/api/inquiries/route.ts
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { parentName, childClass, whatsapp, channelId, channelName } = body;

    // 1. Validation
    if (!channelId || !channelName) {
        return NextResponse.json({ error: 'Source is required' }, { status: 400 });
    }

    // 2. Create the Inquiry
    const inquiry = await Inquiry.create({
      parentName,
      childClass,
      whatsapp,
      channelId,
      channelName
    });

    // 3. Increment the Channel metrics (Always use the ID for the update!)
    await Channel.findByIdAndUpdate(
      channelId,
      { $inc: { leads: 1 } }
    );

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Do the same for GET...
export async function GET() {
  try {
    await dbConnect();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, inquiries },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}