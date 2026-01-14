/* eslint-disable @typescript-eslint/no-explicit-any */
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
        { status: 400,headers: corsHeaders },
         
      )
    }
// app/api/inquiries/route.ts

// ... existing code ...

const normalizedWhatsapp = whatsapp.trim();
const normalizedName = parentName.trim().toLowerCase();

// CHECK 1: WhatsApp Uniqueness
const existingPhone = await Inquiry.findOne({ whatsapp: normalizedWhatsapp });
if (existingPhone) {
  return NextResponse.json(
    { error: 'This WhatsApp number is already registered' },
    { status: 409, headers: corsHeaders }
  );
}

// CHECK 2: Name Uniqueness (Add this part)
const existingName = await Inquiry.findOne({ parentNameNormalized: normalizedName });
if (existingName) {
  return NextResponse.json(
    { error: 'A parent with this name is already registered' },
    { status: 409, headers: corsHeaders }
  );
}

// ... continue to create inquiry ...

    // 3. Create the inquiry
   const inquiry = await Inquiry.create({
  parentName: parentName.trim(),
  parentNameNormalized: normalizedName,
  childClass,
  whatsapp: whatsapp.trim(),
  channelId,
  channelName,
});


    // 4. Increment channel leads
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { leads: 1 },
    })

    return NextResponse.json(
      { success: true, inquiry },
      { status: 201,headers: corsHeaders },
      
    )
  } catch (error: any) {
  if (error.code === 11000) {
    return NextResponse.json(
      { error: 'This parent name is already registered' },
      { status: 409, headers: corsHeaders }
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: 'Server error' },
    { status: 500, headers: corsHeaders }
  );
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