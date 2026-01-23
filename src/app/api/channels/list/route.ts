import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Channel } from "@/models/Channel";

// 1. Define your headers (Note: No trailing slash at the end of the URL!)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await dbConnect();
    
    const channels = await Channel.find({ status: 'active' })
      .select('name _id')
      .lean();

    // 2. Pass the headers into the response
    return NextResponse.json(
      { success: true, data: channels }, 
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load channels" }, 
      { status: 500, headers: corsHeaders } // Even errors need CORS headers!
    );
  }
}

// 3. Handle OPTIONS request (Preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}