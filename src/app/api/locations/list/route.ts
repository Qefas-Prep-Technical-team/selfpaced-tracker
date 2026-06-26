import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Location } from "@/models/Location";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await dbConnect();
    
    const locations = await Location.find({})
      .select('name _id')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      { success: true, data: locations }, 
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load locations" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
