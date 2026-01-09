// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { parentName, childClass, whatsapp } = body;

    if (!parentName || !childClass || !whatsapp) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for existing
    const existing = await Inquiry.findOne({ $or: [{ parentName }, { whatsapp }] });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Inquiry already exists' },
        { status: 409, headers: corsHeaders }
      );
    }

    const inquiry = await Inquiry.create({ parentName, childClass, whatsapp });
    
    return NextResponse.json(
      { success: true, inquiry },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
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