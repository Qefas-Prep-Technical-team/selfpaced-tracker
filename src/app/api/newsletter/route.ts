/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import Newsletter from '@/models/Newsletter';
import { logDeletion } from '@/lib/activityLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // 1. Extract parameters from URL
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const search = searchParams.get("search") || "";

    // 2. Build the dynamic query object
    // If search exists, we look for the string within the email field (case-insensitive)
    const query: any = {};
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    // 3. Execute database operations
    // We pass 'query' to both find (for the data) and count (for pagination)
    const [subscribers, total] = await Promise.all([
      Newsletter.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Newsletter.countDocuments(query),
    ]);

    // 4. Return formatted response
    return NextResponse.json({
      subscribers,
      total,
      page, // Returning 'page' helps frontend sync state
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Newsletter GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers", details: error.message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate the Admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = session.user?.email || "unknown@admin.com";

    // 2. Get ID from SearchParams
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    // 3. Find the subscriber first to get their email for the log
    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    // 4. LOG THE DELETION
    // Label: "Newsletter", Item: subscriber.email, Admin: adminEmail
    await logDeletion(
      "Newsletter", 
      subscriber.email, 
      adminEmail, 
      "Email List"
    );

    // 5. Perform the actual deletion
    await Newsletter.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: "Subscriber removed and logged" 
    });

  } catch (error) {
    console.error("Newsletter Delete Error:", error);
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