import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Click from "@/models/Click";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 1. ADD THIS: Handle the Preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();

    // Vercel and most modern hosts provide these headers automatically in production
    const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown Country";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";

    const newEntry = await Click.create({
      ...body,
      city,
      country,
      userAgent
      // IP is removed from here
    });

    console.log("Saved Click Data:", newEntry);

    return NextResponse.json(
      { success: true }, 
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500, headers: corsHeaders });
  }
}