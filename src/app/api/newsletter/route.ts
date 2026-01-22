// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import Newsletter from '@/models/Newsletter';

// Simple Schema for Newsletter (You can move this to @/models/Newsletter.ts later)


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400, headers: corsHeaders });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'You are already subscribed!' }, { status: 409, headers: corsHeaders });
    }

    await Newsletter.create({ email });

    return NextResponse.json({ success: true }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}

// app/api/newsletter/route.ts
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      Newsletter.find().sort({ subscribedAt: -1 }).skip(skip).limit(limit).lean(),
      Newsletter.countDocuments()
    ]);

    return NextResponse.json({
      subscribers,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await dbConnect();
    await Newsletter.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await dbConnect();
    const updated = await Newsletter.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}