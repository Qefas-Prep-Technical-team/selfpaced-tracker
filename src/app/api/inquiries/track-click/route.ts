import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

// CHANGE: Use your specific domain instead of "*"
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Use a 204 No Content for preflight for better performance
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Connect first
    const body = await req.json();

    const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown Country";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    await Click.create({
      ...body,
      city,
      country,
      userAgent
    });

    return NextResponse.json(
      { success: true }, 
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Tracking API Error:", error);
    // Always include corsHeaders even in the error response
    return NextResponse.json(
      { error: "Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}