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
    await dbConnect()
    const body = await req.json()

    const { parentName, childClass, whatsapp, channelId, channelName } = body

    // 1. Basic validation
    if (!parentName || !whatsapp || !channelId || !channelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 2. Check if inquiry already exists
    const existingInquiry = await Inquiry.findOne({
      parentName: parentName.trim(),
      whatsapp: whatsapp.trim(),
    })

    if (existingInquiry) {
      return NextResponse.json(
        {
          error: 'This parent with the same WhatsApp number already exists',
        },
        { status: 409 } // Conflict
      )
    }

    // 3. Create the inquiry
    const inquiry = await Inquiry.create({
      parentName: parentName.trim(),
      childClass,
      whatsapp: whatsapp.trim(),
      channelId,
      channelName,
    })

    // 4. Increment channel leads
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { leads: 1 },
    })

    return NextResponse.json(
      { success: true, inquiry },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
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